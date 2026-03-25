"use client";

import { useState, useEffect } from "react";
import type { CustomerSummary } from "@/types";

interface CustomerSelectProps {
  onSelect: (customer: { fullName: string; email: string }) => void;
}

export default function CustomerSelect({ onSelect }: CustomerSelectProps) {
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/customers")
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data.customers || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load customers");
        setLoading(false);
      });
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="space-y-2 animate-pulse"><div className="h-4 w-40 rounded bg-gray-200 dark:bg-gray-700" /><div className="h-8 w-full rounded bg-gray-200 dark:bg-gray-700" /></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
        <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (customers.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <label
        htmlFor="customerSearch"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        Select an existing customer (optional)
      </label>
      <input
        id="customerSearch"
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm ring-0 ring-blue-500/0 transition-all duration-150 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:ring-blue-400/40 dark:focus:border-blue-400"
      />
      {search && filtered.length > 0 && (
        <ul className="mt-2 max-h-48 overflow-y-auto rounded-md border border-gray-200 dark:border-gray-600 dark:bg-gray-700">
          {filtered.map((customer) => (
            <li key={customer.id}>
              <button
                type="button"
                onClick={() => {
                  onSelect({
                    fullName: customer.fullName,
                    email: customer.email,
                  });
                  setSearch("");
                }}
                className="w-full px-3 py-2 text-left text-sm transition-colors duration-150 hover:bg-blue-50 focus-visible:bg-blue-50 focus-visible:outline-none dark:hover:bg-blue-900/30 dark:focus-visible:bg-blue-900/30"
              >
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {customer.fullName}
                </span>
                <span className="ml-2 text-gray-500 dark:text-gray-400">{customer.email}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {search && filtered.length === 0 && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No matching customers</p>
      )}
    </div>
  );
}
