"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ApplicationDetail from "@/components/application-detail";
import type { ApplicationDetail as ApplicationDetailType } from "@/types";

export default function OfficerDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [application, setApplication] =
    useState<ApplicationDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplication = useCallback(() => {
    setLoading(true);
    setError("");
    fetch(`/api/applications/${id}`)
      .then((res) => {
        if (res.status === 404) throw new Error("Application not found");
        if (!res.ok) throw new Error("Failed to load application");
        return res.json();
      })
      .then((data) => setApplication(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetchApplication();
  }, [fetchApplication]);

  if (loading) {
    return <p className="text-sm text-gray-500">Loading...</p>;
  }

  if (error) {
    return (
      <div>
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
        <Link
          href="/officer"
          className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          Back to Applications
        </Link>
      </div>
    );
  }

  if (!application) return null;

  return (
    <div>
      <Link
        href="/officer"
        className="mb-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-800"
      >
        &larr; Back to Applications
      </Link>
      <ApplicationDetail
        application={application}
        onDecisionMade={fetchApplication}
      />
    </div>
  );
}
