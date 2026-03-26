"use client";

import { useState } from "react";
import type { Decision, DecisionType } from "@/types";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface DecisionFormProps {
  applicationId: number;
  currentStatus: string;
  qualified: boolean;
  existingDecision: Decision | null;
  onDecisionMade: () => void;
}

export default function DecisionForm({
  applicationId,
  currentStatus,
  existingDecision,
  onDecisionMade,
}: DecisionFormProps) {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (existingDecision) {
    return (
      <div className="animate-fade-in-up rounded-lg border border-border-default bg-bg-section p-4">
        <h4 className="mb-2 text-sm font-semibold text-text-primary">
          Decision Made
        </h4>
        <p className="text-sm">
          <span className="font-medium">Type:</span>{" "}
          <span
            className={
              existingDecision.decisionType === "Approved"
                ? "text-status-approved"
                : "text-status-rejected"
            }
          >
            {existingDecision.decisionType}
          </span>
        </p>
        {existingDecision.decisionNote && (
          <p className="mt-1 text-sm">
            <span className="font-medium">Note:</span>{" "}
            {existingDecision.decisionNote}
          </p>
        )}
        <p className="mt-1 text-xs text-text-muted">
          {formatDate(existingDecision.decidedAt)}
        </p>
      </div>
    );
  }

  if (currentStatus !== "Pending") {
    return null;
  }

  async function handleDecision(decisionType: DecisionType) {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/applications/${applicationId}/decide`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decisionType,
          decisionNote: note.trim() || null,
        }),
      });

      if (res.ok) {
        onDecisionMade();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to submit decision.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-text-primary">Make a Decision</h4>

      {error && (
        <div className="animate-fade-in-up rounded-md bg-status-rejected-bg p-3 text-sm text-status-rejected">
          {error}
        </div>
      )}

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Optional decision note..."
        rows={3}
        className="block w-full rounded-md border border-border-default px-3 py-2 text-sm shadow-sm ring-0 ring-brand-interactive/0 transition-all duration-150 focus:ring-2 focus:ring-brand-interactive/40 focus:border-brand-interactive focus:outline-none"
      />

      <div className="flex gap-3">
        <button
          onClick={() => handleDecision("Approved")}
          disabled={loading}
          className="rounded-md bg-status-approved px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:opacity-90 hover:shadow-md active:scale-[0.98] active:shadow-none disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-approved"
        >
          {loading ? "Submitting..." : "Approve"}
        </button>
        <button
          onClick={() => handleDecision("Rejected")}
          disabled={loading}
          className="rounded-md bg-status-rejected px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:opacity-90 hover:shadow-md active:scale-[0.98] active:shadow-none disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-rejected"
        >
          {loading ? "Submitting..." : "Reject"}
        </button>
      </div>
    </div>
  );
}
