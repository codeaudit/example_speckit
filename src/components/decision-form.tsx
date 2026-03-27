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
      <div className="rounded-xl bg-surface-container-low p-4">
        <h4 className="mb-2 text-sm font-semibold text-on-surface">
          Decision Made
        </h4>
        <p className="text-sm">
          <span className="font-medium text-on-surface-variant">Type:</span>{" "}
          <span
            className={
              existingDecision.decisionType === "Approved"
                ? "text-green-700"
                : "text-error"
            }
          >
            {existingDecision.decisionType}
          </span>
        </p>
        {existingDecision.decisionNote && (
          <p className="mt-1 text-sm text-on-surface">
            <span className="font-medium text-on-surface-variant">Note:</span>{" "}
            {existingDecision.decisionNote}
          </p>
        )}
        <p className="mt-1 text-xs text-on-surface-variant">
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
      <h4 className="text-sm font-semibold text-on-surface">Make a Decision</h4>

      {error && (
        <div className="rounded-xl bg-error-container p-3 text-sm text-on-error-container">
          {error}
        </div>
      )}

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Optional decision note..."
        rows={3}
        className="block w-full rounded-lg bg-surface-container-lowest px-3 py-2 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-on-surface-variant/50"
      />

      <div className="flex gap-3">
        <button
          onClick={() => handleDecision("Approved")}
          disabled={loading}
          className="signature-gradient rounded-xl px-6 py-3 text-sm font-semibold text-on-primary disabled:opacity-50 hover:opacity-90 transition-opacity"
        >
          {loading ? "Submitting..." : "Approve"}
        </button>
        <button
          onClick={() => handleDecision("Rejected")}
          disabled={loading}
          className="rounded-xl border border-outline-variant px-6 py-3 text-sm font-semibold text-on-secondary-fixed-variant bg-transparent disabled:opacity-50 hover:bg-surface-container-low transition-colors"
        >
          {loading ? "Submitting..." : "Reject"}
        </button>
      </div>
    </div>
  );
}
