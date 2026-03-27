"use client";

import { useState } from "react";
import type { BorrowerStatusResponse } from "@/types";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const statusColors: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Approved: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
};

export default function StatusLookup() {
  const [referenceNumber, setReferenceNumber] = useState("");
  const [result, setResult] = useState<BorrowerStatusResponse | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!referenceNumber.trim()) return;

    setResult(null);
    setNotFound(false);
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `/api/applications?ref=${encodeURIComponent(referenceNumber.trim())}`
      );

      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else if (res.status === 404) {
        setNotFound(true);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="flex gap-3">
        <input
          type="text"
          value={referenceNumber}
          onChange={(e) => setReferenceNumber(e.target.value)}
          placeholder="Enter your reference number"
          className="flex-1 rounded-lg bg-surface-container-lowest px-3 py-2 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-on-surface-variant/50"
        />
        <button
          type="submit"
          disabled={loading}
          className="signature-gradient rounded-xl px-4 py-2 text-sm font-semibold text-on-primary disabled:opacity-50 hover:opacity-90 transition-opacity"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {notFound && (
        <div className="mt-6 rounded-xl bg-tertiary-fixed/30 p-4 text-sm text-tertiary">
          No application found with that reference number.
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-xl bg-error-container p-4 text-sm text-on-error-container">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6 rounded-xl bg-surface-container-lowest p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold font-headline text-on-surface">{result.applicantName}</h3>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[result.status] || "bg-gray-100 text-gray-800"}`}
            >
              {result.status}
            </span>
          </div>

          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-on-surface-variant">Reference Number</dt>
              <dd className="font-medium">{result.referenceNumber}</dd>
            </div>
            <div>
              <dt className="text-on-surface-variant">Loan Amount</dt>
              <dd className="font-medium">
                {formatCurrency(result.loanAmount)}
              </dd>
            </div>
            <div>
              <dt className="text-on-surface-variant">Transaction Type</dt>
              <dd className="font-medium capitalize">
                {result.transactionType}
              </dd>
            </div>
            <div>
              <dt className="text-on-surface-variant">Submitted</dt>
              <dd className="font-medium">{formatDate(result.createdAt)}</dd>
            </div>
          </dl>

          {result.decision && (
            <div className="mt-4 pt-4">
              <p className="text-sm font-medium text-on-surface-variant">
                Decision: {result.decision.decisionType}
              </p>
              {result.decision.decisionNote && (
                <p className="mt-1 text-sm text-on-surface-variant">
                  Note: {result.decision.decisionNote}
                </p>
              )}
              <p className="mt-1 text-xs text-on-surface-variant/70">
                {formatDate(result.decision.decidedAt)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
