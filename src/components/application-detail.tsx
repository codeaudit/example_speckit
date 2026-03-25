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
          <h2 className="text-xl font-bold">{a.applicantName}</h2>
          <p className="text-sm text-gray-500">Ref: {a.referenceNumber}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            a.status === "Approved"
              ? "bg-green-100 text-green-800"
              : a.status === "Rejected"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {a.status}
        </span>
      </div>

      {/* Applicant Info */}
      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h3 className="mb-3 text-base font-semibold">Applicant Info</h3>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-gray-500">Name</dt>
            <dd className="font-medium">{a.applicantName}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Email</dt>
            <dd className="font-medium">{a.applicantEmail}</dd>
          </div>
        </dl>
      </section>

      {/* Financial Info */}
      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h3 className="mb-3 text-base font-semibold">Financial Info</h3>
        <dl className="grid gap-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-gray-500">Annual Income</dt>
            <dd className="font-medium">{formatCurrency(a.annualIncome)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Monthly Debts</dt>
            <dd className="font-medium">{formatCurrency(a.monthlyDebts)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Credit Score</dt>
            <dd className="font-medium">{a.creditScore}</dd>
          </div>
        </dl>
      </section>

      {/* Loan Details */}
      <section className="rounded-lg border border-gray-200 bg-white p-5">
        <h3 className="mb-3 text-base font-semibold">Loan Details</h3>
        <dl className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-gray-500">Transaction Type</dt>
            <dd className="font-medium capitalize">{a.transactionType}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Loan Amount</dt>
            <dd className="font-medium">{formatCurrency(a.loanAmount)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Loan Term</dt>
            <dd className="font-medium">
              {a.loanTermMonths} months ({a.loanTermMonths / 12} years)
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Interest Rate</dt>
            <dd className="font-medium">
              {(a.interestRate * 100).toFixed(2)}%
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Property Value</dt>
            <dd className="font-medium">{formatCurrency(a.propertyValue)}</dd>
          </div>
          {a.transactionType === "purchase" && a.purchasePrice !== null && (
            <div>
              <dt className="text-gray-500">Purchase Price</dt>
              <dd className="font-medium">
                {formatCurrency(a.purchasePrice)}
              </dd>
            </div>
          )}
        </dl>
      </section>

      {/* Qualification Summary */}
      {a.qualificationData && (
        <section className="rounded-lg border border-gray-200 bg-white p-5">
          <QualificationSummary data={a.qualificationData} />
        </section>
      )}

      {/* Decision */}
      <section className="rounded-lg border border-gray-200 bg-white p-5">
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
