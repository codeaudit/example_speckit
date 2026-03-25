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
      <div className="animate-fade-in-up rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
        <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Decision Made
        </h4>
        <p className="text-sm">
          <span className="font-medium">Type:</span>{" "}
          <span
            className={
              existingDecision.decisionType === "Approved"
                ? "text-green-700 dark:text-green-400"
                : "text-red-700 dark:text-red-400"
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
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
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
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Make a Decision</h4>

      {error && (
        <div className="animate-fade-in-up rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Optional decision note..."
        rows={3}
        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm ring-0 ring-blue-500/0 transition-all duration-150 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:ring-blue-400/40 dark:focus:border-blue-400"
      />

      <div className="flex gap-3">
        <button
          onClick={() => handleDecision("Approved")}
          disabled={loading}
          className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-green-700 hover:shadow-md active:scale-[0.98] active:shadow-none disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
        >
          {loading ? "Submitting..." : "Approve"}
        </button>
        <button
          onClick={() => handleDecision("Rejected")}
          disabled={loading}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-red-700 hover:shadow-md active:scale-[0.98] active:shadow-none disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          {loading ? "Submitting..." : "Reject"}
        </button>
      </div>
    </div>
  );
}
