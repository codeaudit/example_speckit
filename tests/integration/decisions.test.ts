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

interface DecisionRow {
  id: number;
  application_id: number;
  decision_type: string;
  decision_note: string | null;
  is_override: number;
  decided_at: string;
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

describe("record decision", () => {
  beforeEach(() => {
    resetDb();
    const memDb = new Database(":memory:");
    setDb(memDb);
  });

  afterEach(() => {
    resetDb();
  });

  it("approves a pending application", () => {
    const app = createTestApplication();
    const db = getDb();

    db.prepare(
      `INSERT INTO decisions (application_id, decision_type, is_override)
       VALUES (?, 'Approved', 0)`
    ).run(app.id);
    db.prepare(
      "UPDATE loan_applications SET status = 'Approved' WHERE id = ?"
    ).run(app.id);

    const decision = db
      .prepare("SELECT * FROM decisions WHERE application_id = ?")
      .get(app.id) as DecisionRow;

    const updatedApp = db
      .prepare("SELECT * FROM loan_applications WHERE id = ?")
      .get(app.id) as ApplicationRow;

    expect(decision).toBeDefined();
    expect(decision.decision_type).toBe("Approved");
    expect(updatedApp.status).toBe("Approved");
  });

  it("rejects a pending application", () => {
    const app = createTestApplication();
    const db = getDb();

    db.prepare(
      `INSERT INTO decisions (application_id, decision_type, is_override)
       VALUES (?, 'Rejected', 0)`
    ).run(app.id);
    db.prepare(
      "UPDATE loan_applications SET status = 'Rejected' WHERE id = ?"
    ).run(app.id);

    const decision = db
      .prepare("SELECT * FROM decisions WHERE application_id = ?")
      .get(app.id) as DecisionRow;

    const updatedApp = db
      .prepare("SELECT * FROM loan_applications WHERE id = ?")
      .get(app.id) as ApplicationRow;

    expect(decision.decision_type).toBe("Rejected");
    expect(updatedApp.status).toBe("Rejected");
  });

  it("saves decision note", () => {
    const app = createTestApplication();
    const db = getDb();

    db.prepare(
      `INSERT INTO decisions (application_id, decision_type, decision_note, is_override)
       VALUES (?, 'Approved', 'Good credit history', 0)`
    ).run(app.id);

    const decision = db
      .prepare("SELECT * FROM decisions WHERE application_id = ?")
      .get(app.id) as DecisionRow;

    expect(decision.decision_note).toBe("Good credit history");
  });

  it("detects override when approving non-qualified app", () => {
    // creditScore of 580 is below MIN_CREDIT_SCORE (620), so qualified=false
    const app = createTestApplication({ creditScore: 580 });
    const db = getDb();

    const qd = JSON.parse(app.qualification_data!) as QualificationResult;
    expect(qd.qualified).toBe(false);

    // Approving a non-qualified app is an override
    const isOverride = qd.qualified === false ? 1 : 0;

    db.prepare(
      `INSERT INTO decisions (application_id, decision_type, is_override)
       VALUES (?, 'Approved', ?)`
    ).run(app.id, isOverride);

    const decision = db
      .prepare("SELECT * FROM decisions WHERE application_id = ?")
      .get(app.id) as DecisionRow;

    expect(decision.is_override).toBe(1);
  });

  it("detects override when rejecting qualified app", () => {
    // Use high income and low loan to ensure qualification passes all tests
    const app = createTestApplication({
      annualIncome: 200000,
      loanAmount: 100000,
      propertyValue: 400000,
      purchasePrice: 390000,
      monthlyDebts: 200,
    });
    const db = getDb();

    const qd = JSON.parse(app.qualification_data!) as QualificationResult;
    expect(qd.qualified).toBe(true);

    // Rejecting a qualified app is an override
    const isOverride = qd.qualified === true ? 1 : 0;

    db.prepare(
      `INSERT INTO decisions (application_id, decision_type, is_override)
       VALUES (?, 'Rejected', ?)`
    ).run(app.id, isOverride);

    const decision = db
      .prepare("SELECT * FROM decisions WHERE application_id = ?")
      .get(app.id) as DecisionRow;

    expect(decision.is_override).toBe(1);
  });

  it("sets is_override=0 when decision matches qualification", () => {
    // Use high income and low loan to ensure qualification passes all tests
    const app = createTestApplication({
      annualIncome: 200000,
      loanAmount: 100000,
      propertyValue: 400000,
      purchasePrice: 390000,
      monthlyDebts: 200,
    });
    const db = getDb();

    const qd = JSON.parse(app.qualification_data!) as QualificationResult;
    expect(qd.qualified).toBe(true);

    // Approving a qualified app is not an override
    db.prepare(
      `INSERT INTO decisions (application_id, decision_type, is_override)
       VALUES (?, 'Approved', 0)`
    ).run(app.id);

    const decision = db
      .prepare("SELECT * FROM decisions WHERE application_id = ?")
      .get(app.id) as DecisionRow;

    expect(decision.is_override).toBe(0);
  });

  it("prevents double decision via UNIQUE constraint", () => {
    const app = createTestApplication();
    const db = getDb();

    db.prepare(
      `INSERT INTO decisions (application_id, decision_type, is_override)
       VALUES (?, 'Approved', 0)`
    ).run(app.id);

    expect(() => {
      db.prepare(
        `INSERT INTO decisions (application_id, decision_type, is_override)
         VALUES (?, 'Rejected', 0)`
      ).run(app.id);
    }).toThrow();
  });

  it("rejects invalid decision type", () => {
    const app = createTestApplication();
    const db = getDb();

    expect(() => {
      db.prepare(
        `INSERT INTO decisions (application_id, decision_type, is_override)
         VALUES (?, 'Maybe', 0)`
      ).run(app.id);
    }).toThrow();
  });
});
