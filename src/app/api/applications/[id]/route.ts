import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import type {
  ApplicationDetail,
  QualificationResult,
  Decision,
  TransactionType,
  ApplicationStatus,
} from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();

  const row = db
    .prepare(
      `SELECT la.*, d.id as decision_id, d.decision_type, d.decision_note,
              d.is_override, d.decided_at
       FROM loan_applications la
       LEFT JOIN decisions d ON d.application_id = la.id
       WHERE la.id = ?`
    )
    .get(id) as Record<string, unknown> | undefined;

  if (!row) {
    return Response.json({ error: "Application not found" }, { status: 404 });
  }

  let qualificationData: QualificationResult | null = null;
  if (row.qualification_data) {
    try {
      qualificationData = JSON.parse(row.qualification_data as string) as QualificationResult;
    } catch {
      // ignore parse errors
    }
  }

  const decision: Decision | null = row.decision_id
    ? {
        id: row.decision_id as number,
        applicationId: row.id as number,
        decisionType: row.decision_type as "Approved" | "Rejected",
        decisionNote: (row.decision_note as string | null),
        isOverride: Boolean(row.is_override),
        decidedAt: row.decided_at as string,
      }
    : null;

  const detail: ApplicationDetail = {
    id: row.id as number,
    referenceNumber: row.reference_number as string,
    applicantName: row.applicant_name as string,
    applicantEmail: row.applicant_email as string,
    annualIncome: row.annual_income as number,
    monthlyDebts: row.monthly_debts as number,
    creditScore: row.credit_score as number,
    transactionType: row.transaction_type as TransactionType,
    loanAmount: row.loan_amount as number,
    loanTermMonths: row.loan_term_months as number,
    interestRate: row.interest_rate as number,
    propertyValue: row.property_value as number,
    purchasePrice: (row.purchase_price as number | null),
    status: row.status as ApplicationStatus,
    qualificationData,
    createdAt: row.created_at as string,
    decision,
  };

  return Response.json(detail);
}
