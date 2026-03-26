"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { CustomerWithAppCount } from "@/types";

export default function OfficerCustomerList() {
  const [customers, setCustomers] = useState<CustomerWithAppCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/customers?include=applicationCount")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load customers");
        return res.json();
      })
      .then((data) => setCustomers(data.customers || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="overflow-hidden rounded-lg border border-border-default bg-bg-page shadow-sm">
        <div className="p-4 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="h-4 w-40 rounded bg-bg-section" />
              <div className="h-4 w-48 rounded bg-bg-section" />
              <div className="h-4 w-12 rounded bg-bg-section" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-status-rejected-bg p-4 text-sm text-status-rejected">
        {error}
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="rounded-lg border border-border-default bg-bg-page p-8 text-center">
        <p className="text-sm text-text-muted">No customers found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border-default bg-bg-page shadow-sm">
      <table className="min-w-full divide-y divide-border-default text-sm">
        <thead className="bg-bg-section">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
              Customer Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
              Email
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-muted">
              Applications
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-default">
          {customers.map((customer) => (
            <tr key={customer.id} className="transition-colors duration-150 hover:bg-bg-section">
              <td className="whitespace-nowrap px-6 py-4">
                <Link
                  href={`/officer/customer/${customer.id}`}
                  className="font-medium text-brand-primary hover:text-brand-interactive focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-interactive rounded"
                >
                  {customer.fullName}
                </Link>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-text-muted">
                {customer.email}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right text-text-muted">
                {customer.applicationCount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
