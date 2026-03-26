import { getDb } from "@/lib/db";
import type { Customer, CustomerSummary, CustomerWithAppCount } from "@/types";

export async function getCustomer(id: number): Promise<Customer | null> {
  const db = getDb();
  const row = db.prepare("SELECT * FROM customers WHERE id = ?").get(id) as
    | Record<string, unknown>
    | undefined;

  if (!row) return null;

  return {
    id: row.id as number,
    fullName: row.full_name as string,
    email: row.email as string,
    phone: row.phone as string,
    street: row.street as string,
    city: row.city as string,
    state: row.state as string,
    zipCode: row.zip_code as string,
    createdAt: row.created_at as string,
  };
}

export async function getCustomers(): Promise<CustomerSummary[]> {
  const db = getDb();
  const rows = db
    .prepare("SELECT id, full_name, email FROM customers ORDER BY full_name")
    .all() as Array<{ id: number; full_name: string; email: string }>;

  return rows.map((row) => ({
    id: row.id,
    fullName: row.full_name,
    email: row.email,
  }));
}

export async function getCustomersWithAppCount(): Promise<CustomerWithAppCount[]> {
  const db = getDb();
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

  return rows.map((row) => ({
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    applicationCount: row.application_count,
  }));
}
