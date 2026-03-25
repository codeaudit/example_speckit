import { describe, it, expect, beforeEach, afterEach } from "vitest";
import Database from "better-sqlite3";
import { nanoid } from "nanoid";
import { setDb, getDb, resetDb } from "@/lib/db";
import { evaluateQualification } from "@/lib/qualification";
import { validateApplicationInput } from "@/lib/validation";
import type { LoanApplicationInput, QualificationResult } from "@/types";

const DEFAULT_INPUT: LoanApplicationInput = {
  applicantName: "Jane Doe",
  applicantEmail: "jane@example.com",
  annualIncome: 85000,
  monthlyDebts: 400,
  creditScore: 720,
  transactionType: "purchase",
  loanAmount: 300000,
  loanTermMonths: 360,
  interestRate: 0.065,
  propertyValue: 400000,
  purchasePrice: 390000,
};

interface ApplicationRow {
  id: number;
  reference_number: string;
  applicant_name: string;
  applicant_email: string;
  annual_income: number;
  monthly_debts: number;
  credit_score: number;
  transaction_type: string;
  loan_amount: number;
  loan_term_months: number;
  interest_rate: number;
  property_value: number;
  purchase_price: number | null;
  status: string;
  qualification_data: string | null;
  created_at: string;
}

function createTestApplication(
  overrides?: Partial<LoanApplicationInput>
): ApplicationRow {
  const input: LoanApplicationInput = { ...DEFAULT_INPUT, ...overrides };

  const { valid, errors } = validateApplicationInput(input);
  if (!valid) {
    throw new Error(`Invalid input: ${JSON.stringify(errors)}`);
  }

  const qualification = evaluateQualification(input);
  const referenceNumber = "LN-" + nanoid(8);
  const db = getDb();

  const stmt = db.prepare(`
    INSERT INTO loan_applications (
      reference_number, applicant_name, applicant_email,
      annual_income, monthly_debts, credit_score,
      transaction_type, loan_amount, loan_term_months,
      interest_rate, property_value, purchase_price,
      qualification_data
    ) VALUES (
      @reference_number, @applicant_name, @applicant_email,
      @annual_income, @monthly_debts, @credit_score,
      @transaction_type, @loan_amount, @loan_term_months,
      @interest_rate, @property_value, @purchase_price,
      @qualification_data
    )
  `);

  const info = stmt.run({
    reference_number: referenceNumber,
    applicant_name: input.applicantName,
    applicant_email: input.applicantEmail,
    annual_income: input.annualIncome,
    monthly_debts: input.monthlyDebts,
    credit_score: input.creditScore,
    transaction_type: input.transactionType,
    loan_amount: input.loanAmount,
    loan_term_months: input.loanTermMonths,
    interest_rate: input.interestRate,
    property_value: input.propertyValue,
    purchase_price: input.purchasePrice,
    qualification_data: JSON.stringify(qualification),
  });

  return db
    .prepare("SELECT * FROM loan_applications WHERE id = ?")
    .get(info.lastInsertRowid) as ApplicationRow;
}

describe("create application", () => {
  beforeEach(() => {
    resetDb();
    const memDb = new Database(":memory:");
    setDb(memDb);
  });

  afterEach(() => {
    resetDb();
  });

  it("inserts a valid purchase application", () => {
    const row = createTestApplication();

    expect(row.applicant_name).toBe("Jane Doe");
    expect(row.applicant_email).toBe("jane@example.com");
    expect(row.annual_income).toBe(85000);
    expect(row.monthly_debts).toBe(400);
    expect(row.credit_score).toBe(720);
    expect(row.transaction_type).toBe("purchase");
    expect(row.loan_amount).toBe(300000);
    expect(row.loan_term_months).toBe(360);
    expect(row.interest_rate).toBe(0.065);
    expect(row.property_value).toBe(400000);
    expect(row.purchase_price).toBe(390000);
    expect(row.status).toBe("Pending");
    expect(row.qualification_data).not.toBeNull();

    const qd = JSON.parse(row.qualification_data!) as QualificationResult;
    expect(qd.qualified).toBeDefined();
    expect(typeof qd.qualified).toBe("boolean");
  });

  it("inserts a valid refinance application", () => {
    const row = createTestApplication({
      transactionType: "refinance",
      purchasePrice: null,
    });

    expect(row.transaction_type).toBe("refinance");
    expect(row.purchase_price).toBeNull();

    const qd = JSON.parse(row.qualification_data!) as QualificationResult;
    // For refinance, QV = propertyValue, so LTV = loanAmount / propertyValue * 100
    const expectedLtv = (300000 / 400000) * 100;
    expect(qd.ltvPercent).toBeCloseTo(expectedLtv, 2);
  });

  it("generates unique reference numbers", () => {
    const row1 = createTestApplication();
    const row2 = createTestApplication({ applicantEmail: "jane2@example.com" });

    expect(row1.reference_number).not.toBe(row2.reference_number);
    expect(row1.reference_number).toMatch(/^LN-.{8}$/);
    expect(row2.reference_number).toMatch(/^LN-.{8}$/);
  });

  it("qualification_data contains all required fields", () => {
    const row = createTestApplication();
    const qd = JSON.parse(row.qualification_data!) as Record<string, unknown>;

    expect(qd).toHaveProperty("gmi");
    expect(qd).toHaveProperty("phe");
    expect(qd).toHaveProperty("tmd");
    expect(qd).toHaveProperty("frontEndPercent");
    expect(qd).toHaveProperty("dtiPercent");
    expect(qd).toHaveProperty("ltvPercent");
    expect(qd).toHaveProperty("reserveMonths");
    expect(qd).toHaveProperty("creditScore");
    expect(qd).toHaveProperty("qualified");
    expect(qd).toHaveProperty("failedTests");
    expect(qd).toHaveProperty("calculatedAt");
  });
});

describe("list applications", () => {
  beforeEach(() => {
    resetDb();
    const memDb = new Database(":memory:");
    setDb(memDb);
  });

  afterEach(() => {
    resetDb();
  });

  it("lists pending applications by default", () => {
    createTestApplication();
    createTestApplication({ applicantEmail: "jane2@example.com" });

    const db = getDb();
    const rows = db
      .prepare("SELECT * FROM loan_applications WHERE status = 'Pending'")
      .all() as ApplicationRow[];

    expect(rows).toHaveLength(2);
  });

  it("returns empty array when no applications", () => {
    const db = getDb();
    const rows = db
      .prepare("SELECT * FROM loan_applications WHERE status = 'Pending'")
      .all() as ApplicationRow[];

    expect(rows).toHaveLength(0);
  });

  it("filters by status", () => {
    const row = createTestApplication();
    const db = getDb();

    // Insert a decision and update the application status to Approved
    db.prepare(
      `INSERT INTO decisions (application_id, decision_type, is_override)
       VALUES (?, 'Approved', 0)`
    ).run(row.id);
    db.prepare(
      "UPDATE loan_applications SET status = 'Approved' WHERE id = ?"
    ).run(row.id);

    const pending = db
      .prepare("SELECT * FROM loan_applications WHERE status = 'Pending'")
      .all() as ApplicationRow[];
    expect(pending).toHaveLength(0);

    const approved = db
      .prepare("SELECT * FROM loan_applications WHERE status = 'Approved'")
      .all() as ApplicationRow[];
    expect(approved).toHaveLength(1);
  });
});

describe("lookup by reference number", () => {
  beforeEach(() => {
    resetDb();
    const memDb = new Database(":memory:");
    setDb(memDb);
  });

  afterEach(() => {
    resetDb();
  });

  it("finds application by reference number", () => {
    const row = createTestApplication();
    const db = getDb();

    const found = db
      .prepare("SELECT * FROM loan_applications WHERE reference_number = ?")
      .get(row.reference_number) as ApplicationRow | undefined;

    expect(found).toBeDefined();
    expect(found!.id).toBe(row.id);
    expect(found!.applicant_name).toBe("Jane Doe");
  });

  it("returns undefined for unknown reference", () => {
    const db = getDb();
    const found = db
      .prepare("SELECT * FROM loan_applications WHERE reference_number = ?")
      .get("LN-NONEXIST") as ApplicationRow | undefined;

    expect(found).toBeUndefined();
  });
});

describe("get application by id", () => {
  beforeEach(() => {
    resetDb();
    const memDb = new Database(":memory:");
    setDb(memDb);
  });

  afterEach(() => {
    resetDb();
  });

  it("returns full application detail", () => {
    const row = createTestApplication();
    const db = getDb();

    const found = db
      .prepare("SELECT * FROM loan_applications WHERE id = ?")
      .get(row.id) as ApplicationRow | undefined;

    expect(found).toBeDefined();
    expect(found!.applicant_name).toBe("Jane Doe");
    expect(found!.applicant_email).toBe("jane@example.com");
    expect(found!.annual_income).toBe(85000);
    expect(found!.monthly_debts).toBe(400);
    expect(found!.credit_score).toBe(720);
    expect(found!.transaction_type).toBe("purchase");
    expect(found!.loan_amount).toBe(300000);
    expect(found!.loan_term_months).toBe(360);
    expect(found!.interest_rate).toBe(0.065);
    expect(found!.property_value).toBe(400000);
    expect(found!.purchase_price).toBe(390000);
    expect(found!.status).toBe("Pending");
    expect(found!.qualification_data).not.toBeNull();
    expect(found!.created_at).toBeDefined();
  });

  it("returns null for unknown id", () => {
    const db = getDb();
    const found = db
      .prepare("SELECT * FROM loan_applications WHERE id = ?")
      .get(999) as ApplicationRow | undefined;

    expect(found).toBeUndefined();
  });

  it("includes decision when decided", () => {
    const row = createTestApplication();
    const db = getDb();

    db.prepare(
      `INSERT INTO decisions (application_id, decision_type, decision_note, is_override)
       VALUES (?, 'Approved', 'Looks good', 0)`
    ).run(row.id);
    db.prepare(
      "UPDATE loan_applications SET status = 'Approved' WHERE id = ?"
    ).run(row.id);

    const app = db
      .prepare("SELECT * FROM loan_applications WHERE id = ?")
      .get(row.id) as ApplicationRow;

    const decision = db
      .prepare("SELECT * FROM decisions WHERE application_id = ?")
      .get(row.id) as {
      id: number;
      application_id: number;
      decision_type: string;
      decision_note: string | null;
      is_override: number;
      decided_at: string;
    } | undefined;

    expect(app.status).toBe("Approved");
    expect(decision).toBeDefined();
    expect(decision!.decision_type).toBe("Approved");
    expect(decision!.decision_note).toBe("Looks good");
    expect(decision!.is_override).toBe(0);
    expect(decision!.decided_at).toBeDefined();
  });
});
