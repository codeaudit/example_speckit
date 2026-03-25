import { NextRequest } from "next/server";
import { nanoid } from "nanoid";
import { getDb } from "@/lib/db";
import { validateApplicationInput } from "@/lib/validation";
import { evaluateQualification } from "@/lib/qualification";
import type {
  LoanApplicationInput,
  QualificationResult,
  ApplicationSummary,
  BorrowerStatusResponse,
  DecisionType,
} from "@/types";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { valid, errors } = validateApplicationInput(body);
  if (!valid) {
    return Response.json({ error: "Validation failed", fields: errors }, { status: 400 });
  }

  const input = body as LoanApplicationInput;
  const referenceNumber = "LN-" + nanoid(8);

  const qualificationResult = evaluateQualification({
    annualIncome: input.annualIncome,
    monthlyDebts: input.monthlyDebts,
    creditScore: input.creditScore,
    transactionType: input.transactionType,
    loanAmount: input.loanAmount,
    loanTermMonths: input.loanTermMonths,
    interestRate: input.interestRate,
    propertyValue: input.propertyValue,
    purchasePrice: input.purchasePrice,
  });

  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO loan_applications (
      reference_number, applicant_name, applicant_email,
      annual_income, monthly_debts, credit_score,
      transaction_type, loan_amount, loan_term_months,
      interest_rate, property_value, purchase_price,
      status, qualification_data
    ) VALUES (
      @referenceNumber, @applicantName, @applicantEmail,
      @annualIncome, @monthlyDebts, @creditScore,
      @transactionType, @loanAmount, @loanTermMonths,
      @interestRate, @propertyValue, @purchasePrice,
      @status, @qualificationData
    )
  `);

  const result = stmt.run({
    referenceNumber,
    applicantName: input.applicantName,
    applicantEmail: input.applicantEmail,
    annualIncome: input.annualIncome,
    monthlyDebts: input.monthlyDebts,
    creditScore: input.creditScore,
    transactionType: input.transactionType,
    loanAmount: input.loanAmount,
    loanTermMonths: input.loanTermMonths,
    interestRate: input.interestRate,
    propertyValue: input.propertyValue,
    purchasePrice: input.purchasePrice ?? null,
    status: "Pending",
    qualificationData: JSON.stringify(qualificationResult),
  });

  const created = db
    .prepare("SELECT * FROM loan_applications WHERE id = ?")
    .get(result.lastInsertRowid) as Record<string, unknown>;

  return Response.json(
    {
      id: created.id,
      referenceNumber: created.reference_number,
      status: created.status,
      qualificationData: qualificationResult,
      createdAt: created.created_at,
    },
    { status: 201 }
  );
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ref = searchParams.get("ref");
  const db = getDb();

  if (ref) {
    const row = db
      .prepare(
        `SELECT la.*, d.id as decision_id, d.decision_type, d.decision_note, d.decided_at
         FROM loan_applications la
         LEFT JOIN decisions d ON d.application_id = la.id
         WHERE la.reference_number = ?`
      )
      .get(ref) as Record<string, unknown> | undefined;

    if (!row) {
      return Response.json({ error: "Application not found" }, { status: 404 });
    }

    const response: BorrowerStatusResponse = {
      id: row.id as number,
      referenceNumber: row.reference_number as string,
      applicantName: row.applicant_name as string,
      loanAmount: row.loan_amount as number,
      transactionType: row.transaction_type as "purchase" | "refinance",
      status: row.status as "Pending" | "Approved" | "Rejected",
      decision: row.decision_id
        ? {
            decisionType: row.decision_type as DecisionType,
            decisionNote: (row.decision_note as string | null),
            decidedAt: row.decided_at as string,
          }
        : null,
      createdAt: row.created_at as string,
    };

    return Response.json(response);
  }

  // List mode
  const statusParam = searchParams.get("status") ?? "Pending";

  let rows: Record<string, unknown>[];
  if (statusParam === "all") {
    rows = db
      .prepare(
        `SELECT id, reference_number, applicant_name, loan_amount,
                transaction_type, qualification_data, status, created_at
         FROM loan_applications
         ORDER BY created_at DESC`
      )
      .all() as Record<string, unknown>[];
  } else {
    rows = db
      .prepare(
        `SELECT id, reference_number, applicant_name, loan_amount,
                transaction_type, qualification_data, status, created_at
         FROM loan_applications
         WHERE status = ?
         ORDER BY created_at DESC`
      )
      .all(statusParam) as Record<string, unknown>[];
  }

  const applications: ApplicationSummary[] = rows.map((row) => {
    let qualified: boolean | null = null;
    if (row.qualification_data) {
      try {
        const qd = JSON.parse(row.qualification_data as string) as QualificationResult;
        qualified = qd.qualified;
      } catch {
        // ignore parse errors
      }
    }

    return {
      id: row.id as number,
      referenceNumber: row.reference_number as string,
      applicantName: row.applicant_name as string,
      loanAmount: row.loan_amount as number,
      transactionType: row.transaction_type as "purchase" | "refinance",
      qualified,
      status: row.status as "Pending" | "Approved" | "Rejected",
      createdAt: row.created_at as string,
    };
  });

  return Response.json({ applications });
}
