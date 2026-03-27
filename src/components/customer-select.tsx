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
      <div className="rounded-xl bg-surface-container-low p-4">
        <div className="space-y-2 animate-pulse"><div className="h-4 w-40 rounded bg-surface-container-high" /><div className="h-8 w-full rounded bg-surface-container-high" /></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-error-container p-4">
        <p className="text-sm text-on-error-container">{error}</p>
      </div>
    );
  }

  if (customers.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl bg-surface-container-low p-4">
      <label
        htmlFor="customerSearch"
        className="block text-sm font-medium text-on-surface-variant"
      >
        Select an existing customer (optional)
      </label>
      <input
        id="customerSearch"
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mt-1 block w-full rounded-lg bg-surface-container-lowest px-3 py-2 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-on-surface-variant/50"
      />
      {search && filtered.length > 0 && (
        <ul className="mt-2 max-h-48 overflow-y-auto rounded-lg bg-surface-container-lowest">
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
                className="w-full px-3 py-2 text-left text-sm hover:bg-surface-container-low focus-visible:bg-surface-container-low focus-visible:outline-none transition-colors"
              >
                <span className="font-medium text-on-surface">
                  {customer.fullName}
                </span>
                <span className="ml-2 text-on-surface-variant">{customer.email}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {search && filtered.length === 0 && (
        <p className="mt-2 text-sm text-on-surface-variant">No matching customers</p>
      )}
    </div>
  );
}
