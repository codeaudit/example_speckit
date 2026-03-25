import type { LoanApplicationInput } from "@/types";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function validateApplicationInput(input: unknown): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!isObject(input)) {
    errors._form = "Input must be an object";
    return { valid: false, errors };
  }

  // applicantName
  if (typeof input.applicantName !== "string" || input.applicantName.trim() === "") {
    errors.applicantName = "Name is required";
  }

  // applicantEmail
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (
    typeof input.applicantEmail !== "string" ||
    input.applicantEmail.trim() === "" ||
    !emailRegex.test(input.applicantEmail)
  ) {
    errors.applicantEmail = "Valid email is required";
  }

  // annualIncome
  if (typeof input.annualIncome !== "number" || input.annualIncome <= 0) {
    errors.annualIncome = "Annual income must be a positive number";
  }

  // monthlyDebts
  if (typeof input.monthlyDebts !== "number" || input.monthlyDebts < 0) {
    errors.monthlyDebts = "Monthly debts must be zero or positive";
  }

  // creditScore
  if (
    typeof input.creditScore !== "number" ||
    !Number.isInteger(input.creditScore) ||
    input.creditScore < 300 ||
    input.creditScore > 850
  ) {
    errors.creditScore = "Credit score must be between 300 and 850";
  }

  // transactionType
  if (input.transactionType !== "purchase" && input.transactionType !== "refinance") {
    errors.transactionType = "Transaction type must be 'purchase' or 'refinance'";
  }

  // loanAmount
  if (
    typeof input.loanAmount !== "number" ||
    input.loanAmount < 1000 ||
    input.loanAmount > 500000
  ) {
    errors.loanAmount = "Loan amount must be between 1,000 and 500,000";
  }

  // loanTermMonths
  if (
    typeof input.loanTermMonths !== "number" ||
    !Number.isInteger(input.loanTermMonths) ||
    input.loanTermMonths < 6 ||
    input.loanTermMonths > 360
  ) {
    errors.loanTermMonths = "Loan term must be between 6 and 360 months";
  }

  // interestRate
  if (
    typeof input.interestRate !== "number" ||
    input.interestRate < 0.001 ||
    input.interestRate > 0.20
  ) {
    errors.interestRate = "Interest rate must be between 0.1% and 20%";
  }

  // propertyValue
  if (typeof input.propertyValue !== "number" || input.propertyValue <= 0) {
    errors.propertyValue = "Property value must be a positive number";
  }

  // purchasePrice (required and > 0 only for purchase transactions)
  if (input.transactionType === "purchase") {
    if (typeof input.purchasePrice !== "number" || input.purchasePrice <= 0) {
      errors.purchasePrice = "Purchase price is required for purchase transactions";
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
