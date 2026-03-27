"use client";

import { useState, useEffect } from "react";
import { validateApplicationInput } from "@/lib/validation";
import type { TransactionType } from "@/types";

interface LoanFormProps {
  onSuccess: (data: { referenceNumber: string }) => void;
  prefillName?: string;
  prefillEmail?: string;
}

export default function LoanForm({ onSuccess, prefillName, prefillEmail }: LoanFormProps) {
  const [applicantName, setApplicantName] = useState(prefillName || "");
  const [applicantEmail, setApplicantEmail] = useState(prefillEmail || "");
  const [annualIncome, setAnnualIncome] = useState("");
  const [monthlyDebts, setMonthlyDebts] = useState("");
  const [creditScore, setCreditScore] = useState("");
  const [transactionType, setTransactionType] =
    useState<TransactionType>("purchase");
  const [loanAmount, setLoanAmount] = useState("");
  const [loanTermMonths, setLoanTermMonths] = useState("360");
  const [interestRate, setInterestRate] = useState("");
  const [propertyValue, setPropertyValue] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");

  useEffect(() => {
    if (prefillName !== undefined) setApplicantName(prefillName);
  }, [prefillName]);
  useEffect(() => {
    if (prefillEmail !== undefined) setApplicantEmail(prefillEmail);
  }, [prefillEmail]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setGeneralError("");

    const input = {
      applicantName: applicantName.trim(),
      applicantEmail: applicantEmail.trim(),
      annualIncome: parseFloat(annualIncome),
      monthlyDebts: parseFloat(monthlyDebts),
      creditScore: parseInt(creditScore, 10),
      transactionType,
      loanAmount: parseFloat(loanAmount),
      loanTermMonths: parseInt(loanTermMonths, 10),
      interestRate: parseFloat(interestRate) / 100,
      propertyValue: parseFloat(propertyValue),
      purchasePrice:
        transactionType === "purchase"
          ? parseFloat(purchasePrice)
          : null,
    };

    const validation = validateApplicationInput(input);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (res.status === 201) {
        const data = await res.json();
        onSuccess({ referenceNumber: data.referenceNumber });
      } else if (res.status === 400) {
        const data = await res.json();
        if (data.fields) {
          setErrors(data.fields);
        } else {
          setGeneralError(data.error || "Validation failed");
        }
      } else {
        setGeneralError("Something went wrong. Please try again.");
      }
    } catch {
      setGeneralError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  const fieldClass =
    "mt-1 block w-full rounded-lg bg-surface-container-lowest px-3 py-2 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-on-surface-variant/50";
  const labelClass = "block text-sm font-medium text-on-surface-variant";
  const errorClass = "mt-1 text-xs text-error";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {generalError && (
        <div className="rounded-lg bg-error-container p-4 text-sm text-on-error-container">
          {generalError}
        </div>
      )}

      {/* Applicant Info */}
      <fieldset className="space-y-4">
        <legend className="text-base font-semibold text-on-surface font-headline">
          Applicant Information
        </legend>

        <div>
          <label htmlFor="applicantName" className={labelClass}>
            Full Name
          </label>
          <input
            id="applicantName"
            type="text"
            value={applicantName}
            onChange={(e) => setApplicantName(e.target.value)}
            className={fieldClass}
          />
          {errors.applicantName && (
            <p className={errorClass}>{errors.applicantName}</p>
          )}
        </div>

        <div>
          <label htmlFor="applicantEmail" className={labelClass}>
            Email
          </label>
          <input
            id="applicantEmail"
            type="email"
            value={applicantEmail}
            onChange={(e) => setApplicantEmail(e.target.value)}
            className={fieldClass}
          />
          {errors.applicantEmail && (
            <p className={errorClass}>{errors.applicantEmail}</p>
          )}
        </div>
      </fieldset>

      {/* Financial Info */}
      <fieldset className="space-y-4">
        <legend className="text-base font-semibold text-on-surface font-headline">
          Financial Information
        </legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="annualIncome" className={labelClass}>
              Annual Income
            </label>
            <input
              id="annualIncome"
              type="number"
              value={annualIncome}
              onChange={(e) => setAnnualIncome(e.target.value)}
              className={fieldClass}
            />
            {errors.annualIncome && (
              <p className={errorClass}>{errors.annualIncome}</p>
            )}
          </div>

          <div>
            <label htmlFor="monthlyDebts" className={labelClass}>
              Existing Monthly Debts
            </label>
            <input
              id="monthlyDebts"
              type="number"
              value={monthlyDebts}
              onChange={(e) => setMonthlyDebts(e.target.value)}
              className={fieldClass}
            />
            {errors.monthlyDebts && (
              <p className={errorClass}>{errors.monthlyDebts}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="creditScore" className={labelClass}>
            Credit Score
          </label>
          <input
            id="creditScore"
            type="number"
            min={300}
            max={850}
            value={creditScore}
            onChange={(e) => setCreditScore(e.target.value)}
            className={fieldClass}
          />
          {errors.creditScore && (
            <p className={errorClass}>{errors.creditScore}</p>
          )}
        </div>
      </fieldset>

      {/* Loan Details */}
      <fieldset className="space-y-4">
        <legend className="text-base font-semibold text-on-surface font-headline">
          Loan Details
        </legend>

        <div>
          <label htmlFor="transactionType" className={labelClass}>
            Transaction Type
          </label>
          <select
            id="transactionType"
            value={transactionType}
            onChange={(e) =>
              setTransactionType(e.target.value as TransactionType)
            }
            className={fieldClass}
          >
            <option value="purchase">Purchase</option>
            <option value="refinance">Refinance</option>
          </select>
          {errors.transactionType && (
            <p className={errorClass}>{errors.transactionType}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="loanAmount" className={labelClass}>
              Loan Amount
            </label>
            <input
              id="loanAmount"
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              className={fieldClass}
            />
            {errors.loanAmount && (
              <p className={errorClass}>{errors.loanAmount}</p>
            )}
          </div>

          <div>
            <label htmlFor="loanTermMonths" className={labelClass}>
              Loan Term
            </label>
            <select
              id="loanTermMonths"
              value={loanTermMonths}
              onChange={(e) => setLoanTermMonths(e.target.value)}
              className={fieldClass}
            >
              <option value="180">15 years (180 months)</option>
              <option value="240">20 years (240 months)</option>
              <option value="360">30 years (360 months)</option>
            </select>
            {errors.loanTermMonths && (
              <p className={errorClass}>{errors.loanTermMonths}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="interestRate" className={labelClass}>
            Interest Rate %
          </label>
          <input
            id="interestRate"
            type="number"
            step="0.01"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            placeholder="e.g. 6.5"
            className={fieldClass}
          />
          {errors.interestRate && (
            <p className={errorClass}>{errors.interestRate}</p>
          )}
        </div>
      </fieldset>

      {/* Property Info */}
      <fieldset className="space-y-4">
        <legend className="text-base font-semibold text-on-surface font-headline">
          Property Information
        </legend>

        <div>
          <label htmlFor="propertyValue" className={labelClass}>
            Property Value
          </label>
          <input
            id="propertyValue"
            type="number"
            value={propertyValue}
            onChange={(e) => setPropertyValue(e.target.value)}
            className={fieldClass}
          />
          {errors.propertyValue && (
            <p className={errorClass}>{errors.propertyValue}</p>
          )}
        </div>

        {transactionType === "purchase" && (
          <div>
            <label htmlFor="purchasePrice" className={labelClass}>
              Purchase Price
            </label>
            <input
              id="purchasePrice"
              type="number"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              className={fieldClass}
            />
            {errors.purchasePrice && (
              <p className={errorClass}>{errors.purchasePrice}</p>
            )}
          </div>
        )}
      </fieldset>

      <button
        type="submit"
        disabled={loading}
        className="w-full signature-gradient rounded-xl px-6 py-3 text-sm font-semibold text-on-primary disabled:cursor-not-allowed disabled:opacity-50 hover:opacity-90 transition-opacity"
      >
        {loading ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
}
