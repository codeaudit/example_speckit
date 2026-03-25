import { describe, it, expect, beforeEach, afterEach } from "vitest";
import Database from "better-sqlite3";
import { setDb, getDb, resetDb } from "@/lib/db";

describe("database setup", () => {
  beforeEach(() => {
    resetDb();
    const memDb = new Database(":memory:");
    setDb(memDb);
  });

  afterEach(() => {
    resetDb();
  });

  it("creates loan_applications table", () => {
    const db = getDb();
    const table = db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='loan_applications'"
      )
      .get() as { name: string } | undefined;
    expect(table).toBeDefined();
    expect(table!.name).toBe("loan_applications");
  });

  it("creates decisions table", () => {
    const db = getDb();
    const table = db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='decisions'"
      )
      .get() as { name: string } | undefined;
    expect(table).toBeDefined();
    expect(table!.name).toBe("decisions");
  });

  it("sets user_version to 2 after migrations", () => {
    const db = getDb();
    const result = db.pragma("user_version") as Array<{
      user_version: number;
    }>;
    expect(result[0].user_version).toBe(2);
  });

  it("migrations are idempotent", () => {
    const db = getDb();
    // Call getDb again — should not throw
    const db2 = getDb();
    expect(db2).toBe(db);
    const result = db.pragma("user_version") as Array<{
      user_version: number;
    }>;
    expect(result[0].user_version).toBe(2);
  });

  it("loan_applications has correct columns", () => {
    const db = getDb();
    const columns = db.prepare("PRAGMA table_info(loan_applications)").all() as Array<{ name: string }>;
    const names = columns.map((c) => c.name);
    expect(names).toContain("id");
    expect(names).toContain("reference_number");
    expect(names).toContain("applicant_name");
    expect(names).toContain("applicant_email");
    expect(names).toContain("annual_income");
    expect(names).toContain("monthly_debts");
    expect(names).toContain("credit_score");
    expect(names).toContain("transaction_type");
    expect(names).toContain("loan_amount");
    expect(names).toContain("loan_term_months");
    expect(names).toContain("interest_rate");
    expect(names).toContain("property_value");
    expect(names).toContain("purchase_price");
    expect(names).toContain("status");
    expect(names).toContain("qualification_data");
    expect(names).toContain("created_at");
  });

  it("decisions has correct columns", () => {
    const db = getDb();
    const columns = db.prepare("PRAGMA table_info(decisions)").all() as Array<{ name: string }>;
    const names = columns.map((c) => c.name);
    expect(names).toContain("id");
    expect(names).toContain("application_id");
    expect(names).toContain("decision_type");
    expect(names).toContain("decision_note");
    expect(names).toContain("is_override");
    expect(names).toContain("decided_at");
  });
});
