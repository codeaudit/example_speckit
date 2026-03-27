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
          <h2 className="text-xl font-bold font-headline text-on-surface">{a.applicantName}</h2>
          <p className="text-sm text-on-surface-variant">Ref: {a.referenceNumber}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            a.status === "Approved"
              ? "bg-green-100 text-green-800"
              : a.status === "Rejected"
                ? "bg-red-100 text-red-800"
                : "bg-amber-100 text-amber-800"
          }`}
        >
          {a.status}
        </span>
      </div>

      {/* Interest Rate Lock alert (warm orange — tertiary-fixed) */}
      <div className="bg-tertiary-fixed rounded-xl p-4 flex items-center gap-3">
        <span className="material-symbols-outlined text-tertiary text-xl flex-shrink-0">lock</span>
        <div>
          <p className="text-sm font-semibold text-tertiary">Interest Rate Lock</p>
          <p className="text-xs text-tertiary/80">
            Rate of {(a.interestRate * 100).toFixed(2)}% is locked for 60 days from submission.
          </p>
        </div>
      </div>

      {/* Applicant Info */}
      <section className="rounded-xl bg-surface-container-lowest p-5">
        <h3 className="mb-3 text-base font-semibold font-headline text-on-surface">Applicant Info</h3>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-on-surface-variant">Name</dt>
            <dd className="font-medium text-on-surface">{a.applicantName}</dd>
          </div>
          <div>
            <dt className="text-on-surface-variant">Email</dt>
            <dd className="font-medium text-on-surface">{a.applicantEmail}</dd>
          </div>
        </dl>
      </section>

      {/* Financial Info */}
      <section className="rounded-xl bg-surface-container-lowest p-5">
        <h3 className="mb-3 text-base font-semibold font-headline text-on-surface">Financial Info</h3>
        <dl className="grid gap-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-on-surface-variant">Annual Income</dt>
            <dd className="font-medium text-on-surface">{formatCurrency(a.annualIncome)}</dd>
          </div>
          <div>
            <dt className="text-on-surface-variant">Monthly Debts</dt>
            <dd className="font-medium text-on-surface">{formatCurrency(a.monthlyDebts)}</dd>
          </div>
          <div>
            <dt className="text-on-surface-variant">Credit Score</dt>
            <dd className="font-medium text-on-surface">{a.creditScore}</dd>
          </div>
        </dl>
      </section>

      {/* Loan Details */}
      <section className="rounded-xl bg-surface-container-lowest p-5">
        <h3 className="mb-3 text-base font-semibold font-headline text-on-surface">Loan Details</h3>
        <dl className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-on-surface-variant">Transaction Type</dt>
            <dd className="font-medium capitalize text-on-surface">{a.transactionType}</dd>
          </div>
          <div>
            <dt className="text-on-surface-variant">Loan Amount</dt>
            <dd className="font-medium text-on-surface">{formatCurrency(a.loanAmount)}</dd>
          </div>
          <div>
            <dt className="text-on-surface-variant">Loan Term</dt>
            <dd className="font-medium text-on-surface">
              {a.loanTermMonths} months ({a.loanTermMonths / 12} years)
            </dd>
          </div>
          <div>
            <dt className="text-on-surface-variant">Interest Rate</dt>
            <dd className="font-medium text-on-surface">
              {(a.interestRate * 100).toFixed(2)}%
            </dd>
          </div>
          <div>
            <dt className="text-on-surface-variant">Property Value</dt>
            <dd className="font-medium text-on-surface">{formatCurrency(a.propertyValue)}</dd>
          </div>
          {a.transactionType === "purchase" && a.purchasePrice !== null && (
            <div>
              <dt className="text-on-surface-variant">Purchase Price</dt>
              <dd className="font-medium text-on-surface">
                {formatCurrency(a.purchasePrice)}
              </dd>
            </div>
          )}
        </dl>
      </section>

      {/* Required Documents */}
      <section className="rounded-xl bg-surface-container-lowest p-5">
        <h3 className="mb-3 text-base font-semibold font-headline text-on-surface">Required Documents</h3>
        <ul className="space-y-2 text-sm text-on-surface-variant">
          {["W-2 Forms (last 2 years)", "Bank Statements (last 3 months)", "Pay Stubs (last 30 days)", "Tax Returns (last 2 years)", "Government-Issued ID"].map((doc) => (
            <li key={doc} className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-on-surface-variant/50">radio_button_unchecked</span>
              {doc}
            </li>
          ))}
        </ul>
      </section>

      {/* Qualification Summary */}
      {a.qualificationData && (
        <section className="rounded-xl bg-surface-container-lowest p-5">
          <QualificationSummary data={a.qualificationData} />
        </section>
      )}

      {/* Decision */}
      <section className="rounded-xl bg-surface-container-lowest p-5">
        <h3 className="mb-3 text-base font-semibold font-headline text-on-surface">Decision</h3>
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
