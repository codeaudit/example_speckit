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

export default async function OfficerCustomerDetailPage({
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
          href="/officer"
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          &larr; Back to Customer List
        </Link>
      </div>

      <h1 className="text-2xl font-bold dark:text-gray-100">
        {customer.fullName}
      </h1>

      <CustomerDetail customer={customer} />

      <div>
        <h2 className="mb-4 text-lg font-semibold dark:text-gray-100">
          Loan Applications
        </h2>
        <CustomerApplications
          customerId={customer.id}
          showReviewLink={true}
          emptyMessage="No loan applications for this customer."
        />
      </div>
    </div>
  );
}
