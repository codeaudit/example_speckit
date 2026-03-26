"use client";

import Link from "next/link";
import type { CustomerSummary } from "@/types";

interface CustomerListProps {
  customers: CustomerSummary[];
}

export default function CustomerList({ customers }: CustomerListProps) {
  if (customers.length === 0) {
    return (
      <div className="rounded-lg border border-border-default bg-bg-page p-8 text-center">
        <p className="text-sm text-text-muted">No customers found</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border-default bg-bg-page">
      <table className="min-w-full divide-y divide-border-default">
        <thead className="bg-bg-section">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted"
            >
              Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted"
            >
              Email
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-default">
          {customers.map((customer) => (
            <tr key={customer.id} className="transition-colors duration-150 hover:bg-bg-section">
              <td className="whitespace-nowrap px-6 py-4">
                <Link
                  href={`/customers/${customer.id}`}
                  className="text-sm font-medium text-brand-primary hover:text-brand-interactive focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-interactive rounded"
                >
                  {customer.fullName}
                </Link>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-text-muted">
                {customer.email}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
