"use client";

import Link from "next/link";
import type { CustomerSummary } from "@/types";

interface CustomerListProps {
  customers: CustomerSummary[];
}

export default function CustomerList({ customers }: CustomerListProps) {
  if (customers.length === 0) {
    return (
      <div className="rounded-xl bg-surface-container-lowest p-8 text-center">
        <p className="text-sm text-on-surface-variant">No customers found</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-surface-container-lowest">
      <table className="min-w-full text-sm">
        <thead className="bg-surface-container-high">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-on-surface-variant"
            >
              Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-on-surface-variant"
            >
              Email
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-on-surface-variant"
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, idx) => (
            <tr key={customer.id} className={`hover:bg-surface-container-low transition-colors ${idx % 2 === 0 ? "" : "bg-surface"}`}>
              <td className="whitespace-nowrap px-6 py-4">
                <Link
                  href={`/customers/${customer.id}`}
                  className="font-medium text-primary hover:text-primary-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary rounded"
                >
                  {customer.fullName}
                </Link>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-on-surface-variant">
                {customer.email}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800">
                  New
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
