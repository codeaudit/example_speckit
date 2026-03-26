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
    return (
      <div className="space-y-6">
        <div className="h-4 w-32 animate-pulse rounded bg-bg-section" />
        <div className="space-y-4 rounded-lg border border-border-default bg-bg-page p-5">
          <div className="h-6 w-48 animate-pulse rounded bg-bg-section" />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="h-4 w-full animate-pulse rounded bg-bg-section" />
            <div className="h-4 w-full animate-pulse rounded bg-bg-section" />
          </div>
        </div>
        <div className="space-y-4 rounded-lg border border-border-default bg-bg-page p-5">
          <div className="h-5 w-36 animate-pulse rounded bg-bg-section" />
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="h-4 w-full animate-pulse rounded bg-bg-section" />
            <div className="h-4 w-full animate-pulse rounded bg-bg-section" />
            <div className="h-4 w-full animate-pulse rounded bg-bg-section" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="rounded-md bg-status-rejected-bg p-4 text-sm text-status-rejected">
          {error}
        </div>
        <Link
          href="/officer"
          className="mt-4 inline-block text-sm font-medium text-brand-primary hover:text-brand-interactive"
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
        className="mb-4 inline-block text-sm font-medium text-brand-primary hover:text-brand-interactive"
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
