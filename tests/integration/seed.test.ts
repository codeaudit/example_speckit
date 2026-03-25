import { describe, it, expect, beforeEach, afterEach } from "vitest";
import Database from "better-sqlite3";
import { setDb, getDb, resetDb } from "@/lib/db";

describe("customer seed data migration", () => {
  beforeEach(() => {
    resetDb();
    const db = new Database(":memory:");
    setDb(db);
  });

  afterEach(() => {
    resetDb();
  });

  it("creates customers table with 10 rows", () => {
    const db = getDb();

    const table = db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='customers'"
      )
      .get() as { name: string } | undefined;
    expect(table).toBeDefined();
    expect(table!.name).toBe("customers");

    const count = db.prepare("SELECT COUNT(*) as cnt FROM customers").get() as {
      cnt: number;
    };
    expect(count.cnt).toBe(10);
  });

  it("all seed records have complete data (no NULL fields except created_at)", () => {
    const db = getDb();

    const rows = db.prepare("SELECT * FROM customers").all() as Array<
      Record<string, unknown>
    >;
    expect(rows).toHaveLength(10);

    for (const row of rows) {
      expect(row.full_name, "full_name is NULL").not.toBeNull();
      expect(row.email, "email is NULL").not.toBeNull();
      expect(row.phone, "phone is NULL").not.toBeNull();
      expect(row.street, "street is NULL").not.toBeNull();
      expect(row.city, "city is NULL").not.toBeNull();
      expect(row.state, "state is NULL").not.toBeNull();
      expect(row.zip_code, "zip_code is NULL").not.toBeNull();
    }
  });

  it("calling getDb() again does NOT duplicate records (still 10)", () => {
    const db1 = getDb();
    const count1 = db1
      .prepare("SELECT COUNT(*) as cnt FROM customers")
      .get() as { cnt: number };
    expect(count1.cnt).toBe(10);

    // Simulate a restart by calling getDb() again
    const db2 = getDb();
    const count2 = db2
      .prepare("SELECT COUNT(*) as cnt FROM customers")
      .get() as { cnt: number };
    expect(count2.cnt).toBe(10);
  });

  it("seed data is idempotent — migration skips seed if customers already exist", () => {
    // First: get a DB with all migrations run (including seed)
    const db = getDb();
    expect(
      (db.prepare("SELECT COUNT(*) as cnt FROM customers").get() as { cnt: number }).cnt
    ).toBe(10);

    // Manually add an extra customer
    db.prepare(
      `INSERT INTO customers (full_name, email, phone, street, city, state, zip_code)
       VALUES ('Extra Person', 'extra@email.com', '555-0000', '1 Main St', 'Anywhere', 'NY', '10001')`
    ).run();
    expect(
      (db.prepare("SELECT COUNT(*) as cnt FROM customers").get() as { cnt: number }).cnt
    ).toBe(11);

    // Roll back user_version to 2 so migration v3 would attempt to re-run
    db.pragma("user_version = 2");

    // Detach from singleton without closing the connection
    // Then re-set the same open instance to re-trigger migrations
    (globalThis as Record<string, unknown>).__testDb = db;
    // Use a new in-memory DB to prove the seed check works
    resetDb();
    const freshDb = new Database(":memory:");
    // Manually create tables + add a customer to test skip logic
    freshDb.exec(`CREATE TABLE IF NOT EXISTS loan_applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reference_number TEXT NOT NULL UNIQUE,
      applicant_name TEXT NOT NULL,
      applicant_email TEXT NOT NULL,
      annual_income REAL NOT NULL,
      monthly_debts REAL NOT NULL,
      credit_score INTEGER NOT NULL,
      transaction_type TEXT NOT NULL,
      loan_amount REAL NOT NULL,
      loan_term_months INTEGER NOT NULL,
      interest_rate REAL NOT NULL,
      property_value REAL NOT NULL,
      purchase_price REAL,
      status TEXT NOT NULL DEFAULT 'Pending',
      qualification_data TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`);
    freshDb.exec(`CREATE TABLE IF NOT EXISTS decisions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      application_id INTEGER NOT NULL UNIQUE,
      decision_type TEXT NOT NULL,
      decision_note TEXT,
      is_override INTEGER NOT NULL DEFAULT 0,
      decided_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`);
    freshDb.exec(`CREATE TABLE IF NOT EXISTS customers (
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
    // Insert one customer to simulate pre-existing data
    freshDb.prepare(
      `INSERT INTO customers (full_name, email, phone, street, city, state, zip_code)
       VALUES ('Pre-Existing', 'pre@email.com', '555-0000', '1 Main St', 'Anywhere', 'NY', '10001')`
    ).run();
    // Set user_version to 2 so migration v3 will run
    freshDb.pragma("user_version = 2");
    setDb(freshDb);

    // Should still be 1 — seed was skipped because table already had rows
    const count = (
      freshDb.prepare("SELECT COUNT(*) as cnt FROM customers").get() as { cnt: number }
    ).cnt;
    expect(count).toBe(1);
  });
});
