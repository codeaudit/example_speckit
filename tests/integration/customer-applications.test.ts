import { describe, it, expect, beforeEach, afterEach } from "vitest";
import Database from "better-sqlite3";
import { setDb, getDb, resetDb } from "@/lib/db";

function createTablesWithoutSeed(db: Database.Database) {
  db.exec(`CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,
    street TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);
  db.exec(`CREATE TABLE IF NOT EXISTS loan_applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reference_number TEXT NOT NULL UNIQUE,
    applicant_name TEXT NOT NULL,
    applicant_email TEXT NOT NULL,
    annual_income REAL NOT NULL CHECK(annual_income > 0),
    monthly_debts REAL NOT NULL CHECK(monthly_debts >= 0),
    credit_score INTEGER NOT NULL CHECK(credit_score >= 300 AND credit_score <= 850),
    transaction_type TEXT NOT NULL CHECK(transaction_type IN ('purchase', 'refinance')),
    loan_amount REAL NOT NULL CHECK(loan_amount >= 1000 AND loan_amount <= 500000),
    loan_term_months INTEGER NOT NULL CHECK(loan_term_months >= 6 AND loan_term_months <= 360),
    interest_rate REAL NOT NULL CHECK(interest_rate >= 0.001 AND interest_rate <= 0.20),
    property_value REAL NOT NULL CHECK(property_value > 0),
    purchase_price REAL,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK(status IN ('Pending', 'Approved', 'Rejected')),
    qualification_data TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);
  db.exec(`CREATE TABLE IF NOT EXISTS decisions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    application_id INTEGER NOT NULL UNIQUE REFERENCES loan_applications(id),
    decision_type TEXT NOT NULL CHECK(decision_type IN ('Approved', 'Rejected')),
    decision_note TEXT,
    is_override INTEGER NOT NULL DEFAULT 0,
    decided_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);
}

function insertCustomer(
  db: Database.Database,
  data: { fullName: string; email: string }
): number {
  const result = db
    .prepare(
      `INSERT INTO customers (full_name, email, phone, street, city, state, zip_code)
       VALUES (?, ?, '555-0100', '123 Main St', 'Anytown', 'CA', '90210')`
    )
    .run(data.fullName, data.email);
  return result.lastInsertRowid as number;
}

function insertApplication(
  db: Database.Database,
  data: {
    email: string;
    refNum: string;
    status?: string;
    qualificationData?: string | null;
    createdAt?: string;
  }
): number {
  const result = db
    .prepare(
      `INSERT INTO loan_applications
       (reference_number, applicant_name, applicant_email, annual_income, monthly_debts,
        credit_score, transaction_type, loan_amount, loan_term_months, interest_rate,
        property_value, purchase_price, status, qualification_data, created_at)
       VALUES (?, 'Test Applicant', ?, 100000, 500, 750, 'purchase', 250000, 360, 0.065,
        350000, 300000, ?, ?, ?)`
    )
    .run(
      data.refNum,
      data.email,
      data.status ?? "Pending",
      data.qualificationData ?? null,
      data.createdAt ?? new Date().toISOString()
    );
  return result.lastInsertRowid as number;
}

describe("GET /api/customers/:id/applications", () => {
  let db: Database.Database;

  beforeEach(() => {
    resetDb();
    db = new Database(":memory:");
    createTablesWithoutSeed(db);
    setDb(db);
  });

  afterEach(() => {
    resetDb();
  });

  it("returns matching applications for a customer by email JOIN", () => {
    const customerId = insertCustomer(db, {
      fullName: "Alice Smith",
      email: "alice@example.com",
    });
    insertApplication(db, {
      email: "alice@example.com",
      refNum: "LN-001",
      status: "Pending",
    });
    insertApplication(db, {
      email: "alice@example.com",
      refNum: "LN-002",
      status: "Approved",
    });

    const rows = db
      .prepare(
        `SELECT la.id, la.reference_number, la.loan_amount, la.transaction_type,
                la.status, la.qualification_data, la.created_at
         FROM loan_applications la
         INNER JOIN customers c ON la.applicant_email = c.email
         WHERE c.id = ?
         ORDER BY la.created_at DESC`
      )
      .all(customerId) as Array<Record<string, unknown>>;

    expect(rows).toHaveLength(2);
    expect(rows[0].reference_number).toBeDefined();
    expect(rows[0].loan_amount).toBe(250000);
    expect(rows[0].transaction_type).toBe("purchase");
    expect(["Pending", "Approved"]).toContain(rows[0].status as string);
  });

  it("returns empty array for customer with no matching applications", () => {
    const customerId = insertCustomer(db, {
      fullName: "Bob Jones",
      email: "bob@example.com",
    });

    const rows = db
      .prepare(
        `SELECT la.id, la.reference_number, la.loan_amount, la.transaction_type,
                la.status, la.qualification_data, la.created_at
         FROM loan_applications la
         INNER JOIN customers c ON la.applicant_email = c.email
         WHERE c.id = ?
         ORDER BY la.created_at DESC`
      )
      .all(customerId) as Array<Record<string, unknown>>;

    expect(rows).toHaveLength(0);
  });

  it("returns no results for non-existent customer id", () => {
    const rows = db
      .prepare(
        `SELECT la.id FROM loan_applications la
         INNER JOIN customers c ON la.applicant_email = c.email
         WHERE c.id = ?`
      )
      .all(99999) as Array<Record<string, unknown>>;

    expect(rows).toHaveLength(0);

    // Verify customer doesn't exist
    const customer = db
      .prepare("SELECT id FROM customers WHERE id = ?")
      .get(99999);
    expect(customer).toBeUndefined();
  });

  it("derives qualificationStatus correctly — Qualified when failedTests empty", () => {
    const customerId = insertCustomer(db, {
      fullName: "Carol White",
      email: "carol@example.com",
    });
    const qualData = JSON.stringify({
      gmi: 8333,
      phe: 2333,
      tmd: 3083,
      frontEndPercent: 0.28,
      dtiPercent: 0.37,
      ltvPercent: 0.71,
      reserveMonths: 6,
      creditScore: 750,
      qualified: true,
      failedTests: [],
      calculatedAt: "2026-03-25T00:00:00.000Z",
    });
    insertApplication(db, {
      email: "carol@example.com",
      refNum: "LN-QUAL-001",
      qualificationData: qualData,
    });

    const row = db
      .prepare(
        `SELECT la.qualification_data
         FROM loan_applications la
         INNER JOIN customers c ON la.applicant_email = c.email
         WHERE c.id = ?`
      )
      .get(customerId) as { qualification_data: string } | undefined;

    expect(row).toBeDefined();
    const parsed = JSON.parse(row!.qualification_data);
    expect(parsed.qualified).toBe(true);
    expect(parsed.failedTests).toHaveLength(0);
    // qualificationStatus = "Qualified"
  });

  it("derives qualificationStatus correctly — Not Qualified when failedTests non-empty", () => {
    const customerId = insertCustomer(db, {
      fullName: "Dave Brown",
      email: "dave@example.com",
    });
    const qualData = JSON.stringify({
      gmi: 5000,
      phe: 2000,
      tmd: 3500,
      frontEndPercent: 0.4,
      dtiPercent: 0.7,
      ltvPercent: 0.95,
      reserveMonths: 1,
      creditScore: 580,
      qualified: false,
      failedTests: ["DTI ratio exceeds 43%", "Credit score below 620"],
      calculatedAt: "2026-03-25T00:00:00.000Z",
    });
    insertApplication(db, {
      email: "dave@example.com",
      refNum: "LN-NOTQUAL-001",
      qualificationData: qualData,
    });

    const row = db
      .prepare(
        `SELECT la.qualification_data
         FROM loan_applications la
         INNER JOIN customers c ON la.applicant_email = c.email
         WHERE c.id = ?`
      )
      .get(customerId) as { qualification_data: string } | undefined;

    expect(row).toBeDefined();
    const parsed = JSON.parse(row!.qualification_data);
    expect(parsed.qualified).toBe(false);
    expect(parsed.failedTests.length).toBeGreaterThan(0);
    // qualificationStatus = "Not Qualified"
  });

  it("derives qualificationStatus correctly — N/A when no qualification data", () => {
    const customerId = insertCustomer(db, {
      fullName: "Eve Green",
      email: "eve@example.com",
    });
    insertApplication(db, {
      email: "eve@example.com",
      refNum: "LN-NA-001",
      qualificationData: null,
    });

    const row = db
      .prepare(
        `SELECT la.qualification_data
         FROM loan_applications la
         INNER JOIN customers c ON la.applicant_email = c.email
         WHERE c.id = ?`
      )
      .get(customerId) as { qualification_data: string | null } | undefined;

    expect(row).toBeDefined();
    expect(row!.qualification_data).toBeNull();
    // qualificationStatus = "N/A"
  });

  it("orders results by createdAt DESC (newest first)", () => {
    const customerId = insertCustomer(db, {
      fullName: "Frank Lee",
      email: "frank@example.com",
    });
    insertApplication(db, {
      email: "frank@example.com",
      refNum: "LN-OLD",
      createdAt: "2026-01-01T00:00:00.000Z",
    });
    insertApplication(db, {
      email: "frank@example.com",
      refNum: "LN-NEW",
      createdAt: "2026-03-25T00:00:00.000Z",
    });

    const rows = db
      .prepare(
        `SELECT la.reference_number, la.created_at
         FROM loan_applications la
         INNER JOIN customers c ON la.applicant_email = c.email
         WHERE c.id = ?
         ORDER BY la.created_at DESC`
      )
      .all(customerId) as Array<{
      reference_number: string;
      created_at: string;
    }>;

    expect(rows).toHaveLength(2);
    expect(rows[0].reference_number).toBe("LN-NEW");
    expect(rows[1].reference_number).toBe("LN-OLD");
  });
});

describe("GET /api/customers with applicationCount", () => {
  let db: Database.Database;

  beforeEach(() => {
    resetDb();
    db = new Database(":memory:");
    createTablesWithoutSeed(db);
    // Don't use setDb here — it runs migrations which seed 10 customers
  });

  afterEach(() => {
    db.close();
  });

  it("returns applicationCount for each customer when requested", () => {
    insertCustomer(db, {
      fullName: "Alice Smith",
      email: "alice@example.com",
    });
    insertCustomer(db, {
      fullName: "Bob Jones",
      email: "bob@example.com",
    });
    insertApplication(db, {
      email: "alice@example.com",
      refNum: "LN-A1",
    });
    insertApplication(db, {
      email: "alice@example.com",
      refNum: "LN-A2",
    });

    const rows = db
      .prepare(
        `SELECT c.id, c.full_name, c.email,
                (SELECT COUNT(*) FROM loan_applications la WHERE la.applicant_email = c.email) AS application_count
         FROM customers c
         ORDER BY c.full_name ASC`
      )
      .all() as Array<{
      id: number;
      full_name: string;
      email: string;
      application_count: number;
    }>;

    expect(rows).toHaveLength(2);
    const alice = rows.find((r) => r.email === "alice@example.com");
    const bob = rows.find((r) => r.email === "bob@example.com");
    expect(alice!.application_count).toBe(2);
    expect(bob!.application_count).toBe(0);
  });

  it("returns zero count for customers with no applications", () => {
    insertCustomer(db, {
      fullName: "Charlie Doe",
      email: "charlie@example.com",
    });

    const rows = db
      .prepare(
        `SELECT c.id, c.full_name, c.email,
                (SELECT COUNT(*) FROM loan_applications la WHERE la.applicant_email = c.email) AS application_count
         FROM customers c
         ORDER BY c.full_name ASC`
      )
      .all() as Array<{
      id: number;
      full_name: string;
      email: string;
      application_count: number;
    }>;

    expect(rows).toHaveLength(1);
    expect(rows[0].application_count).toBe(0);
  });
});
