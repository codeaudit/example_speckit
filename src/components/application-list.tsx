"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ApplicationSummary } from "@/types";

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

export default function ApplicationList() {
  const [applications, setApplications] = useState<ApplicationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/applications?status=Pending")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load applications");
        return res.json();
      })
      .then((data) => setApplications(data.applications || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="overflow-x-auto rounded-lg border border-border-default bg-bg-page shadow-sm">
        <div className="p-4 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="h-4 w-32 rounded bg-bg-section" />
              <div className="h-4 w-24 rounded bg-bg-section" />
              <div className="h-4 w-20 rounded bg-bg-section" />
              <div className="h-4 w-16 rounded bg-bg-section" />
              <div className="h-4 w-20 rounded bg-bg-section" />
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

  if (applications.length === 0) {
    return (
      <p className="text-sm text-text-muted">No pending applications.</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border-default bg-bg-page shadow-sm">
      <table className="min-w-full divide-y divide-border-default text-sm">
        <thead className="bg-bg-section">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-text-muted">
              Applicant Name
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
              Date
            </th>
            <th className="px-4 py-3 text-left font-medium text-text-muted">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-default">
          {applications.map((app) => (
            <tr key={app.id} className="transition-colors duration-150 hover:bg-bg-section">
              <td className="px-4 py-3 font-medium">{app.applicantName}</td>
              <td className="px-4 py-3 text-right">
                {formatCurrency(app.loanAmount)}
              </td>
              <td className="px-4 py-3 capitalize">{app.transactionType}</td>
              <td className="px-4 py-3">
                {app.qualified === null ? (
                  <span className="text-text-muted">N/A</span>
                ) : app.qualified ? (
                  <span className="rounded-full bg-status-approved-bg px-2 py-0.5 text-xs font-medium text-status-approved shadow-sm ring-1 ring-inset ring-status-approved/20">
                    Qualified
                  </span>
                ) : (
                  <span className="rounded-full bg-status-rejected-bg px-2 py-0.5 text-xs font-medium text-status-rejected shadow-sm ring-1 ring-inset ring-status-rejected/20">
                    Not Qualified
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-text-muted">
                {formatDate(app.createdAt)}
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/officer/${app.id}`}
                  className="font-medium text-brand-primary hover:text-brand-interactive focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-interactive rounded"
                >
                  Review
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
