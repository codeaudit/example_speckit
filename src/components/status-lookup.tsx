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
  Pending: "bg-amber-100 text-amber-800 shadow-sm ring-1 ring-inset ring-amber-200/50 dark:bg-amber-900 dark:text-amber-200 dark:ring-amber-400/20",
  Approved: "bg-green-100 text-green-800 shadow-sm ring-1 ring-inset ring-green-200/50 dark:bg-green-900 dark:text-green-200 dark:ring-green-400/20",
  Rejected: "bg-red-100 text-red-800 shadow-sm ring-1 ring-inset ring-red-200/50 dark:bg-red-900 dark:text-red-200 dark:ring-red-400/20",
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
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm ring-0 ring-blue-500/0 transition-all duration-150 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:ring-blue-400/40 dark:focus:border-blue-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-blue-700 hover:shadow-md active:scale-[0.98] active:shadow-none disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {notFound && (
        <div className="mt-6 animate-fade-in-up rounded-md bg-yellow-50 p-4 text-sm text-yellow-800 dark:bg-amber-900/20 dark:text-amber-300">
          No application found with that reference number.
        </div>
      )}

      {error && (
        <div className="mt-6 animate-fade-in-up rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6 animate-fade-in-up rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold dark:text-gray-100">{result.applicantName}</h3>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[result.status] || "bg-gray-100 text-gray-800"}`}
            >
              {result.status}
            </span>
          </div>

          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-gray-500 dark:text-gray-400">Reference Number</dt>
              <dd className="font-medium">{result.referenceNumber}</dd>
            </div>
            <div>
              <dt className="text-gray-500 dark:text-gray-400">Loan Amount</dt>
              <dd className="font-medium">
                {formatCurrency(result.loanAmount)}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500 dark:text-gray-400">Transaction Type</dt>
              <dd className="font-medium capitalize">
                {result.transactionType}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500 dark:text-gray-400">Submitted</dt>
              <dd className="font-medium">{formatDate(result.createdAt)}</dd>
            </div>
          </dl>

          {result.decision && (
            <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Decision: {result.decision.decisionType}
              </p>
              {result.decision.decisionNote && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Note: {result.decision.decisionNote}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                {formatDate(result.decision.decidedAt)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
