import { notFound } from "next/navigation";
import Link from "next/link";
import CustomerDetail from "@/components/customer-detail";
import CustomerApplications from "@/components/customer-applications";
import type { Customer } from "@/types";

async function getCustomer(id: number): Promise<Customer | null> {
  const { getDb } = await import("@/lib/db");
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

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await getCustomer(parseInt(id, 10));

  if (!customer) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/customers"
          className="text-sm text-primary hover:text-primary-container"
        >
          &larr; Back to Customer Directory
        </Link>
      </div>
      <CustomerDetail customer={customer} />

      <div>
        <h2 className="mb-4 text-lg font-semibold font-headline text-on-surface">
          Loan Applications
        </h2>
        <CustomerApplications customerId={customer.id} />
      </div>
    </div>
  );
}
