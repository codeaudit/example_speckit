import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import type { CustomerSummary, CustomerWithAppCount } from "@/types";

export async function GET(request: NextRequest) {
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const include = searchParams.get("include") ?? "";

  if (include.split(",").includes("applicationCount")) {
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

    const customers: CustomerWithAppCount[] = rows.map((row) => ({
      id: row.id,
      fullName: row.full_name,
      email: row.email,
      applicationCount: row.application_count,
    }));

    return Response.json({ customers });
  }

  const rows = db
    .prepare(
      `SELECT id, full_name, email FROM customers ORDER BY full_name`
    )
    .all() as Array<{ id: number; full_name: string; email: string }>;

  const customers: CustomerSummary[] = rows.map((row) => ({
    id: row.id,
    fullName: row.full_name,
    email: row.email,
  }));

  return Response.json({ customers });
}
