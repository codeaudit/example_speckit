import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import type { Customer } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();

  const row = db
    .prepare("SELECT * FROM customers WHERE id = ?")
    .get(id) as Record<string, unknown> | undefined;

  if (!row) {
    return Response.json({ error: "Customer not found" }, { status: 404 });
  }

  const customer: Customer = {
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

  return Response.json(customer);
}
