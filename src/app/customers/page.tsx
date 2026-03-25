import CustomerList from "@/components/customer-list";
import type { CustomerSummary } from "@/types";

async function getCustomers(): Promise<CustomerSummary[]> {
  const { getDb } = await import("@/lib/db");
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

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
        Customer Directory
      </h1>
      <CustomerList customers={customers} />
    </div>
  );
}
