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
      <div className="overflow-x-auto rounded-xl bg-surface-container-lowest">
        <div className="p-4 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="h-4 w-32 rounded bg-surface-container-high" />
              <div className="h-4 w-24 rounded bg-surface-container-high" />
              <div className="h-4 w-20 rounded bg-surface-container-high" />
              <div className="h-4 w-16 rounded bg-surface-container-high" />
              <div className="h-4 w-20 rounded bg-surface-container-high" />
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

  if (applications.length === 0) {
    return (
      <p className="text-sm text-on-surface-variant">No pending applications.</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl bg-surface-container-lowest">
      <table className="min-w-full text-sm">
        <thead className="bg-surface-container-high">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-on-surface-variant">
              Applicant Name
            </th>
            <th className="px-4 py-3 text-right font-medium text-on-surface-variant">
              Loan Amount
            </th>
            <th className="px-4 py-3 text-left font-medium text-on-surface-variant">
              Type
            </th>
            <th className="px-4 py-3 text-left font-medium text-on-surface-variant">
              Qualification
            </th>
            <th className="px-4 py-3 text-left font-medium text-on-surface-variant">
              Date
            </th>
            <th className="px-4 py-3 text-left font-medium text-on-surface-variant">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id} className="hover:bg-surface-container-low transition-colors">
              <td className="px-4 py-3 font-medium text-on-surface">{app.applicantName}</td>
              <td className="px-4 py-3 text-right text-on-surface">
                {formatCurrency(app.loanAmount)}
              </td>
              <td className="px-4 py-3 capitalize text-on-surface-variant">{app.transactionType}</td>
              <td className="px-4 py-3">
                {app.qualified === null ? (
                  <span className="text-on-surface-variant/50">N/A</span>
                ) : app.qualified ? (
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                    Qualified
                  </span>
                ) : (
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                    Not Qualified
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-on-surface-variant">
                {formatDate(app.createdAt)}
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/officer/${app.id}`}
                  className="font-medium text-primary hover:text-primary-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary rounded"
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
