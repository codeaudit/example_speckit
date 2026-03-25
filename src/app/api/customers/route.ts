import { getDb } from "@/lib/db";
import type { CustomerSummary } from "@/types";

export async function GET() {
  const db = getDb();

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
