"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { CustomerApplication } from "@/types";

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
    month: "short",
    day: "numeric",
  });
}

const qualificationBadge: Record<string, string> = {
  Qualified:
    "bg-status-approved-bg text-status-approved shadow-sm ring-1 ring-inset ring-status-approved/20",
  "Not Qualified":
    "bg-status-rejected-bg text-status-rejected shadow-sm ring-1 ring-inset ring-status-rejected/20",
  "N/A": "bg-bg-section text-text-muted shadow-sm ring-1 ring-inset ring-border-default",
};

const statusBadge: Record<string, string> = {
  Pending:
    "bg-status-pending-bg text-status-pending shadow-sm ring-1 ring-inset ring-status-pending/20",
  Approved:
    "bg-status-approved-bg text-status-approved shadow-sm ring-1 ring-inset ring-status-approved/20",
  Rejected: "bg-status-rejected-bg text-status-rejected shadow-sm ring-1 ring-inset ring-status-rejected/20",
};

interface CustomerApplicationsProps {
  customerId: number;
  showReviewLink?: boolean;
  emptyMessage?: string;
}

export default function CustomerApplications({
  customerId,
  showReviewLink = false,
  emptyMessage = "No loan applications found.",
}: CustomerApplicationsProps) {
  const [applications, setApplications] = useState<CustomerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/customers/${customerId}/applications`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load applications");
        return res.json();
      })
      .then((data) => setApplications(data.applications || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [customerId]);

  if (loading) {
    return (
      <div className="overflow-hidden rounded-lg border border-border-default bg-bg-page shadow-sm">
        <div className="p-4 space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="h-4 w-28 rounded bg-bg-section" />
              <div className="h-4 w-24 rounded bg-bg-section" />
              <div className="h-4 w-20 rounded bg-bg-section" />
              <div className="h-4 w-20 rounded bg-bg-section" />
              <div className="h-4 w-16 rounded bg-bg-section" />
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

  if (applications.length === 0) {
    return (
      <div className="rounded-lg border border-border-default bg-bg-page p-8 text-center">
        <p className="text-sm text-text-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border-default bg-bg-page shadow-sm">
      <table className="min-w-full divide-y divide-border-default text-sm">
        <thead className="bg-bg-section">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-text-muted">
              Reference
            </th>
            <th className="px-4 py-3 text-right font-medium text-text-muted">
              Loan Amount
            </th>
            <th className="px-4 py-3 text-left font-medium text-text-muted">
              Type
            </th>
            <th className="px-4 py-3 text-left font-medium text-text-muted">
              Qualification
            </th>
            <th className="px-4 py-3 text-left font-medium text-text-muted">
              Status
            </th>
            <th className="px-4 py-3 text-left font-medium text-text-muted">
              Date
            </th>
            {showReviewLink && (
              <th className="px-4 py-3 text-left font-medium text-text-muted">
                Action
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-default">
          {applications.map((app) => (
            <tr
              key={app.id}
              className="transition-colors duration-150 hover:bg-bg-section"
            >
              <td className="whitespace-nowrap px-4 py-3 font-medium">
                {app.referenceNumber}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right">
                {formatCurrency(app.loanAmount)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 capitalize">
                {app.transactionType}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    qualificationBadge[app.qualificationStatus] ?? ""
                  }`}
                >
                  {app.qualificationStatus}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    statusBadge[app.status] ?? ""
                  }`}
                >
                  {app.status}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-text-muted">
                {formatDate(app.createdAt)}
              </td>
              {showReviewLink && (
                <td className="whitespace-nowrap px-4 py-3">
                  {app.status === "Pending" ? (
                    <Link
                      href={`/officer/${app.id}`}
                      className="font-medium text-brand-primary hover:text-brand-interactive focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-interactive rounded"
                    >
                      Review
                    </Link>
                  ) : (
                    <span className="text-text-muted">—</span>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
