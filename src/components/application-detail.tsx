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
          <h2 className="text-xl font-bold dark:text-gray-100">{a.applicantName}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Ref: {a.referenceNumber}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium shadow-sm ring-1 ring-inset ${
            a.status === "Approved"
              ? "bg-green-100 text-green-800 ring-green-200/50 dark:bg-green-900 dark:text-green-200 dark:ring-green-400/20"
              : a.status === "Rejected"
                ? "bg-red-100 text-red-800 ring-red-200/50 dark:bg-red-900 dark:text-red-200 dark:ring-red-400/20"
                : "bg-amber-100 text-amber-800 ring-amber-200/50 dark:bg-amber-900 dark:text-amber-200 dark:ring-amber-400/20"
          }`}
        >
          {a.status}
        </span>
      </div>

      {/* Applicant Info */}
      <section className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-3 text-base font-semibold">Applicant Info</h3>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Name</dt>
            <dd className="font-medium dark:text-gray-200">{a.applicantName}</dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Email</dt>
            <dd className="font-medium dark:text-gray-200">{a.applicantEmail}</dd>
          </div>
        </dl>
      </section>

      {/* Financial Info */}
      <section className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-3 text-base font-semibold">Financial Info</h3>
        <dl className="grid gap-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Annual Income</dt>
            <dd className="font-medium dark:text-gray-200">{formatCurrency(a.annualIncome)}</dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Monthly Debts</dt>
            <dd className="font-medium dark:text-gray-200">{formatCurrency(a.monthlyDebts)}</dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Credit Score</dt>
            <dd className="font-medium dark:text-gray-200">{a.creditScore}</dd>
          </div>
        </dl>
      </section>

      {/* Loan Details */}
      <section className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-3 text-base font-semibold">Loan Details</h3>
        <dl className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Transaction Type</dt>
            <dd className="font-medium capitalize dark:text-gray-200">{a.transactionType}</dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Loan Amount</dt>
            <dd className="font-medium dark:text-gray-200">{formatCurrency(a.loanAmount)}</dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Loan Term</dt>
            <dd className="font-medium dark:text-gray-200">
              {a.loanTermMonths} months ({a.loanTermMonths / 12} years)
            </dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Interest Rate</dt>
            <dd className="font-medium dark:text-gray-200">
              {(a.interestRate * 100).toFixed(2)}%
            </dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Property Value</dt>
            <dd className="font-medium dark:text-gray-200">{formatCurrency(a.propertyValue)}</dd>
          </div>
          {a.transactionType === "purchase" && a.purchasePrice !== null && (
            <div>
              <dt className="text-gray-500 dark:text-gray-400">Purchase Price</dt>
              <dd className="font-medium dark:text-gray-200">
                {formatCurrency(a.purchasePrice)}
              </dd>
            </div>
          )}
        </dl>
      </section>

      {/* Qualification Summary */}
      {a.qualificationData && (
        <section className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <QualificationSummary data={a.qualificationData} />
        </section>
      )}

      {/* Decision */}
      <section className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
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
