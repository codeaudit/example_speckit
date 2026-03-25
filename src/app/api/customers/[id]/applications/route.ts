import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import type { CustomerApplication, QualificationResult } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();

  // Verify customer exists
  const customer = db
    .prepare("SELECT id FROM customers WHERE id = ?")
    .get(id) as { id: number } | undefined;

  if (!customer) {
    return Response.json({ error: "Customer not found" }, { status: 404 });
  }

  const rows = db
    .prepare(
      `SELECT la.id, la.reference_number, la.loan_amount, la.transaction_type,
              la.status, la.qualification_data, la.created_at
       FROM loan_applications la
       INNER JOIN customers c ON la.applicant_email = c.email
       WHERE c.id = ?
       ORDER BY la.created_at DESC`
    )
    .all(id) as Array<Record<string, unknown>>;

  const applications: CustomerApplication[] = rows.map((row) => {
    let qualificationStatus: "Qualified" | "Not Qualified" | "N/A" = "N/A";
    if (row.qualification_data) {
      try {
        const qualData = JSON.parse(
          row.qualification_data as string
        ) as QualificationResult;
        qualificationStatus =
          qualData.failedTests.length === 0 ? "Qualified" : "Not Qualified";
      } catch {
        // If parse fails, treat as N/A
      }
    }

    return {
      id: row.id as number,
      referenceNumber: row.reference_number as string,
      loanAmount: row.loan_amount as number,
      transactionType: row.transaction_type as string,
      status: row.status as "Pending" | "Approved" | "Rejected",
      qualificationStatus,
      createdAt: row.created_at as string,
    };
  });

  return Response.json({ applications });
}
