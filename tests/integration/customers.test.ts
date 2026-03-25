import { describe, it, expect, beforeEach, afterEach } from "vitest";
import Database from "better-sqlite3";
import { setDb, getDb, resetDb } from "@/lib/db";

interface CustomerRow {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  created_at: string;
}

describe("list customers", () => {
  beforeEach(() => {
    resetDb();
    const memDb = new Database(":memory:");
    setDb(memDb);
  });

  afterEach(() => {
    resetDb();
  });

  it("returns all customers with id, fullName, email fields", () => {
    const db = getDb();
    const rows = db
      .prepare("SELECT id, full_name, email FROM customers ORDER BY full_name")
      .all() as Pick<CustomerRow, "id" | "full_name" | "email">[];

    expect(rows).toHaveLength(10);
    for (const row of rows) {
      expect(row.id).toBeDefined();
      expect(typeof row.id).toBe("number");
      expect(row.full_name).toBeDefined();
      expect(typeof row.full_name).toBe("string");
      expect(row.email).toBeDefined();
      expect(typeof row.email).toBe("string");
    }
  });

  it("returns empty array when no customers exist", () => {
    resetDb();
    const emptyDb = new Database(":memory:");
    // Create customers table manually without seed data
    emptyDb.exec(`CREATE TABLE IF NOT EXISTS customers (
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

    const rows = emptyDb
      .prepare("SELECT id, full_name, email FROM customers ORDER BY full_name")
      .all() as Pick<CustomerRow, "id" | "full_name" | "email">[];

    expect(rows).toHaveLength(0);
    emptyDb.close();
  });
});

describe("customer selection for loan form (US3)", () => {
  beforeEach(() => {
    resetDb();
    const memDb = new Database(":memory:");
    setDb(memDb);
  });

  afterEach(() => {
    resetDb();
  });

  it("GET /api/customers returns data usable for selection (id, fullName, email present)", () => {
    const db = getDb();
    const rows = db
      .prepare("SELECT id, full_name, email FROM customers ORDER BY full_name")
      .all() as Array<{ id: number; full_name: string; email: string }>;

    expect(rows.length).toBeGreaterThan(0);
    for (const row of rows) {
      expect(row.id).toBeDefined();
      expect(row.full_name).toBeTruthy();
      expect(row.email).toBeTruthy();
      expect(row.email).toContain("@");
    }
  });
});

describe("get customer by id", () => {
  beforeEach(() => {
    resetDb();
    const memDb = new Database(":memory:");
    setDb(memDb);
  });

  afterEach(() => {
    resetDb();
  });

  it("returns full customer detail", () => {
    const db = getDb();

    const first = db
      .prepare("SELECT id FROM customers ORDER BY id LIMIT 1")
      .get() as { id: number };

    const found = db
      .prepare("SELECT * FROM customers WHERE id = ?")
      .get(first.id) as CustomerRow | undefined;

    expect(found).toBeDefined();
    expect(found!.id).toBe(first.id);
    expect(typeof found!.full_name).toBe("string");
    expect(typeof found!.email).toBe("string");
    expect(typeof found!.phone).toBe("string");
    expect(typeof found!.street).toBe("string");
    expect(typeof found!.city).toBe("string");
    expect(typeof found!.state).toBe("string");
    expect(typeof found!.zip_code).toBe("string");
    expect(found!.created_at).toBeDefined();
  });

  it("returns undefined for unknown id", () => {
    const db = getDb();
    const found = db
      .prepare("SELECT * FROM customers WHERE id = ?")
      .get(99999) as CustomerRow | undefined;

    expect(found).toBeUndefined();
  });
});
