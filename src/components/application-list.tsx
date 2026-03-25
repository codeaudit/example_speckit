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
      .then((data) => setApplications(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-sm text-gray-500">Loading...</p>;
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <p className="text-sm text-gray-500">No pending applications.</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-600">
              Applicant Name
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">
              Loan Amount
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">
              Type
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">
              Qualification
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">
              Date
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {applications.map((app) => (
            <tr key={app.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium">{app.applicantName}</td>
              <td className="px-4 py-3">
                {formatCurrency(app.loanAmount)}
              </td>
              <td className="px-4 py-3 capitalize">{app.transactionType}</td>
              <td className="px-4 py-3">
                {app.qualified === null ? (
                  <span className="text-gray-400">N/A</span>
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
              <td className="px-4 py-3 text-gray-500">
                {formatDate(app.createdAt)}
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/officer/${app.id}`}
                  className="font-medium text-blue-600 hover:text-blue-800"
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
