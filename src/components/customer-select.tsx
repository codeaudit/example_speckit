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
      <div className="rounded-lg border border-border-default bg-bg-page p-4">
        <div className="space-y-2 animate-pulse"><div className="h-4 w-40 rounded bg-bg-section" /><div className="h-8 w-full rounded bg-bg-section" /></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-status-rejected bg-status-rejected-bg p-4">
        <p className="text-sm text-status-rejected">{error}</p>
      </div>
    );
  }

  if (customers.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-border-default bg-bg-page p-4">
      <label
        htmlFor="customerSearch"
        className="block text-sm font-medium text-text-primary"
      >
        Select an existing customer (optional)
      </label>
      <input
        id="customerSearch"
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mt-1 block w-full rounded-md border border-border-default px-3 py-2 text-sm shadow-sm ring-0 ring-brand-interactive/0 transition-all duration-150 focus:ring-2 focus:ring-brand-interactive/40 focus:border-brand-interactive focus:outline-none"
      />
      {search && filtered.length > 0 && (
        <ul className="mt-2 max-h-48 overflow-y-auto rounded-md border border-border-default">
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
                className="w-full px-3 py-2 text-left text-sm transition-colors duration-150 hover:bg-bg-section focus-visible:bg-bg-section focus-visible:outline-none"
              >
                <span className="font-medium text-text-primary">
                  {customer.fullName}
                </span>
                <span className="ml-2 text-text-muted">{customer.email}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {search && filtered.length === 0 && (
        <p className="mt-2 text-sm text-text-muted">No matching customers</p>
      )}
    </div>
  );
}
