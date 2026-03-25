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
    "bg-green-100 text-green-800 shadow-sm ring-1 ring-inset ring-green-200/50 dark:bg-green-900 dark:text-green-200 dark:ring-green-400/20",
  "Not Qualified":
    "bg-red-100 text-red-800 shadow-sm ring-1 ring-inset ring-red-200/50 dark:bg-red-900 dark:text-red-200 dark:ring-red-400/20",
  "N/A": "bg-gray-100 text-gray-600 shadow-sm ring-1 ring-inset ring-gray-200/50 dark:bg-gray-700 dark:text-gray-400 dark:ring-gray-400/20",
};

const statusBadge: Record<string, string> = {
  Pending:
    "bg-amber-100 text-amber-800 shadow-sm ring-1 ring-inset ring-amber-200/50 dark:bg-amber-900 dark:text-amber-200 dark:ring-amber-400/20",
  Approved:
    "bg-green-100 text-green-800 shadow-sm ring-1 ring-inset ring-green-200/50 dark:bg-green-900 dark:text-green-200 dark:ring-green-400/20",
  Rejected: "bg-red-100 text-red-800 shadow-sm ring-1 ring-inset ring-red-200/50 dark:bg-red-900 dark:text-red-200 dark:ring-red-400/20",
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
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="p-4 space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="h-4 w-28 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" />
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
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800/50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">
              Reference
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
              Status
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">
              Date
            </th>
            {showReviewLink && (
              <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-400">
                Action
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {applications.map((app) => (
            <tr
              key={app.id}
              className="transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <td className="whitespace-nowrap px-4 py-3 font-medium dark:text-gray-200">
                {app.referenceNumber}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right dark:text-gray-200">
                {formatCurrency(app.loanAmount)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 capitalize dark:text-gray-200">
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
              <td className="whitespace-nowrap px-4 py-3 text-gray-500 dark:text-gray-400">
                {formatDate(app.createdAt)}
              </td>
              {showReviewLink && (
                <td className="whitespace-nowrap px-4 py-3">
                  {app.status === "Pending" ? (
                    <Link
                      href={`/officer/${app.id}`}
                      className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 rounded"
                    >
                      Review
                    </Link>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500">—</span>
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
