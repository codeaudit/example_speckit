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
      <div className="overflow-hidden rounded-xl bg-surface-container-lowest">
        <div className="p-4 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="h-4 w-40 rounded bg-surface-container-high" />
              <div className="h-4 w-48 rounded bg-surface-container-high" />
              <div className="h-4 w-12 rounded bg-surface-container-high" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-error-container p-4 text-sm text-on-error-container">
        {error}
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="rounded-xl bg-surface-container-lowest p-8 text-center">
        <p className="text-sm text-on-surface-variant">No customers found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-surface-container-lowest">
      <table className="min-w-full text-sm">
        <thead className="bg-surface-container-high">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-on-surface-variant">
              Customer Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-on-surface-variant">
              Email
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-on-surface-variant">
              Applications
            </th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className="hover:bg-surface-container-low transition-colors">
              <td className="whitespace-nowrap px-6 py-4">
                <Link
                  href={`/officer/customer/${customer.id}`}
                  className="font-medium text-primary hover:text-primary-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary rounded"
                >
                  {customer.fullName}
                </Link>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-on-surface-variant">
                {customer.email}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right text-on-surface-variant">
                {customer.applicationCount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
