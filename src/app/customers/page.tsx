import CustomerList from "@/components/customer-list";
import { getCustomers } from "@/lib/customers";

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
