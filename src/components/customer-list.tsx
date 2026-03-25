"use client";

import Link from "next/link";
import type { CustomerSummary } from "@/types";

interface CustomerListProps {
  customers: CustomerSummary[];
}

export default function CustomerList({ customers }: CustomerListProps) {
  if (customers.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-400">No customers found</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800/50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
            >
              Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
            >
              Email
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {customers.map((customer) => (
            <tr key={customer.id} className="transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td className="whitespace-nowrap px-6 py-4">
                <Link
                  href={`/customers/${customer.id}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 rounded"
                >
                  {customer.fullName}
                </Link>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                {customer.email}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
