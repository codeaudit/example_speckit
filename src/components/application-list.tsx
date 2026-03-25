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
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="p-4 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-12 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
        {error}
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">No pending applications.</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800/50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">
              Applicant Name
            </th>
            <th className="px-4 py-3 text-right font-medium text-gray-600 dark:text-gray-400">
              Loan Amount
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">
              Type
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">
              Qualification
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">
              Date
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {applications.map((app) => (
            <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td className="px-4 py-3 font-medium dark:text-gray-200">{app.applicantName}</td>
              <td className="px-4 py-3 text-right">
                {formatCurrency(app.loanAmount)}
              </td>
              <td className="px-4 py-3 capitalize">{app.transactionType}</td>
              <td className="px-4 py-3">
                {app.qualified === null ? (
                  <span className="text-gray-400 dark:text-gray-500">N/A</span>
                ) : app.qualified ? (
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                    Qualified
                  </span>
                ) : (
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200">
                    Not Qualified
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                {formatDate(app.createdAt)}
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/officer/${app.id}`}
                  className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 rounded"
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
