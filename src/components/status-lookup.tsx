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
  Pending: "bg-status-pending-bg text-status-pending shadow-sm ring-1 ring-inset ring-status-pending/20",
  Approved: "bg-status-approved-bg text-status-approved shadow-sm ring-1 ring-inset ring-status-approved/20",
  Rejected: "bg-status-rejected-bg text-status-rejected shadow-sm ring-1 ring-inset ring-status-rejected/20",
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
          className="flex-1 rounded-md border border-border-default px-3 py-2 text-sm shadow-sm ring-0 ring-brand-interactive/0 transition-all duration-150 focus:ring-2 focus:ring-brand-interactive/40 focus:border-brand-interactive focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-brand-interactive hover:shadow-md active:scale-[0.98] active:shadow-none disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-interactive"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {notFound && (
        <div className="mt-6 animate-fade-in-up rounded-md bg-status-pending-bg p-4 text-sm text-status-pending">
          No application found with that reference number.
        </div>
      )}

      {error && (
        <div className="mt-6 animate-fade-in-up rounded-md bg-status-rejected-bg p-4 text-sm text-status-rejected">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6 animate-fade-in-up rounded-lg border border-border-default bg-bg-page p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">{result.applicantName}</h3>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[result.status] || "bg-bg-section text-text-primary"}`}
            >
              {result.status}
            </span>
          </div>

          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-text-muted">Reference Number</dt>
              <dd className="font-medium">{result.referenceNumber}</dd>
            </div>
            <div>
              <dt className="text-text-muted">Loan Amount</dt>
              <dd className="font-medium">
                {formatCurrency(result.loanAmount)}
              </dd>
            </div>
            <div>
              <dt className="text-text-muted">Transaction Type</dt>
              <dd className="font-medium capitalize">
                {result.transactionType}
              </dd>
            </div>
            <div>
              <dt className="text-text-muted">Submitted</dt>
              <dd className="font-medium">{formatDate(result.createdAt)}</dd>
            </div>
          </dl>

          {result.decision && (
            <div className="mt-4 border-t border-border-default pt-4">
              <p className="text-sm font-medium text-text-primary">
                Decision: {result.decision.decisionType}
              </p>
              {result.decision.decisionNote && (
                <p className="mt-1 text-sm text-text-muted">
                  Note: {result.decision.decisionNote}
                </p>
              )}
              <p className="mt-1 text-xs text-text-muted">
                {formatDate(result.decision.decidedAt)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
