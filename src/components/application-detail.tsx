"use client";

import type { ApplicationDetail as ApplicationDetailType } from "@/types";
import QualificationSummary from "@/components/qualification-summary";
import DecisionForm from "@/components/decision-form";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(value);
}

interface ApplicationDetailProps {
  application: ApplicationDetailType;
  onDecisionMade: () => void;
}

export default function ApplicationDetail({
  application,
  onDecisionMade,
}: ApplicationDetailProps) {
  const a = application;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-text-primary">{a.applicantName}</h2>
          <p className="text-sm text-text-muted">Ref: {a.referenceNumber}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium shadow-sm ring-1 ring-inset ${
            a.status === "Approved"
              ? "bg-status-approved-bg text-status-approved ring-status-approved/20"
              : a.status === "Rejected"
                ? "bg-status-rejected-bg text-status-rejected ring-status-rejected/20"
                : "bg-status-pending-bg text-status-pending ring-status-pending/20"
          }`}
        >
          {a.status}
        </span>
      </div>

      {/* Applicant Info */}
      <section className="rounded-lg border border-border-default bg-bg-page p-5">
        <h3 className="mb-3 text-base font-semibold">Applicant Info</h3>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-text-muted">Name</dt>
            <dd className="font-medium text-text-primary">{a.applicantName}</dd>
          </div>
          <div>
            <dt className="text-text-muted">Email</dt>
            <dd className="font-medium text-text-primary">{a.applicantEmail}</dd>
          </div>
        </dl>
      </section>

      {/* Financial Info */}
      <section className="rounded-lg border border-border-default bg-bg-page p-5">
        <h3 className="mb-3 text-base font-semibold">Financial Info</h3>
        <dl className="grid gap-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-text-muted">Annual Income</dt>
            <dd className="font-medium text-text-primary">{formatCurrency(a.annualIncome)}</dd>
          </div>
          <div>
            <dt className="text-text-muted">Monthly Debts</dt>
            <dd className="font-medium text-text-primary">{formatCurrency(a.monthlyDebts)}</dd>
          </div>
          <div>
            <dt className="text-text-muted">Credit Score</dt>
            <dd className="font-medium text-text-primary">{a.creditScore}</dd>
          </div>
        </dl>
      </section>

      {/* Loan Details */}
      <section className="rounded-lg border border-border-default bg-bg-page p-5">
        <h3 className="mb-3 text-base font-semibold">Loan Details</h3>
        <dl className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-text-muted">Transaction Type</dt>
            <dd className="font-medium capitalize text-text-primary">{a.transactionType}</dd>
          </div>
          <div>
            <dt className="text-text-muted">Loan Amount</dt>
            <dd className="font-medium text-text-primary">{formatCurrency(a.loanAmount)}</dd>
          </div>
          <div>
            <dt className="text-text-muted">Loan Term</dt>
            <dd className="font-medium text-text-primary">
              {a.loanTermMonths} months ({a.loanTermMonths / 12} years)
            </dd>
          </div>
          <div>
            <dt className="text-text-muted">Interest Rate</dt>
            <dd className="font-medium text-text-primary">
              {(a.interestRate * 100).toFixed(2)}%
            </dd>
          </div>
          <div>
            <dt className="text-text-muted">Property Value</dt>
            <dd className="font-medium text-text-primary">{formatCurrency(a.propertyValue)}</dd>
          </div>
          {a.transactionType === "purchase" && a.purchasePrice !== null && (
            <div>
              <dt className="text-text-muted">Purchase Price</dt>
              <dd className="font-medium text-text-primary">
                {formatCurrency(a.purchasePrice)}
              </dd>
            </div>
          )}
        </dl>
      </section>

      {/* Qualification Summary */}
      {a.qualificationData && (
        <section className="rounded-lg border border-border-default bg-bg-page p-5">
          <QualificationSummary data={a.qualificationData} />
        </section>
      )}

      {/* Decision */}
      <section className="rounded-lg border border-border-default bg-bg-page p-5">
        <h3 className="mb-3 text-base font-semibold">Decision</h3>
        <DecisionForm
          applicationId={a.id}
          currentStatus={a.status}
          qualified={a.qualificationData?.qualified ?? false}
          existingDecision={a.decision}
          onDecisionMade={onDecisionMade}
        />
      </section>
    </div>
  );
}
