import type { TransactionType, QualificationInput, QualificationResult } from "@/types";
import {
  calculateMonthlyPropertyTax,
  calculateMonthlyInsurance,
  calculateMonthlyMI,
  calculateAVA,
  calculateRFC,
  MONTHLY_HOA,
  MAX_DTI,
  MAX_FRONT_END,
  MAX_LTV,
  MIN_CREDIT_SCORE,
  REQUIRED_RESERVE_MONTHS,
} from "./defaults";

export function calculateGMI(annualIncome: number): number {
  return annualIncome / 12;
}

export function calculatePI(
  loanAmount: number,
  monthlyRate: number,
  totalPayments: number
): number {
  if (monthlyRate === 0) {
    return loanAmount / totalPayments;
  }
  const factor = Math.pow(1 + monthlyRate, totalPayments);
  return (loanAmount * (monthlyRate * factor)) / (factor - 1);
}

export function calculatePHE(
  pi: number,
  monthlyTax: number,
  monthlyInsurance: number,
  monthlyHOA: number,
  monthlyMI: number
): number {
  return pi + monthlyTax + monthlyInsurance + monthlyHOA + monthlyMI;
}

export function calculateQV(
  transactionType: TransactionType,
  propertyValue: number,
  purchasePrice: number | null
): number {
  if (transactionType === "purchase" && purchasePrice !== null) {
    return Math.min(purchasePrice, propertyValue);
  }
  return propertyValue;
}

export function calculateLTV(loanAmount: number, qv: number): number {
  return (loanAmount / qv) * 100;
}

export function calculateFrontEndRatio(phe: number, gmi: number): number {
  return (phe / gmi) * 100;
}

export function calculateDTI(tmd: number, gmi: number): number {
  return (tmd / gmi) * 100;
}

export function calculateReserveMonths(
  ava: number,
  rfc: number,
  phe: number
): number {
  if (phe === 0) return Infinity;
  return (ava - rfc) / phe;
}

export function evaluateQualification(
  input: QualificationInput
): QualificationResult {
  const {
    annualIncome,
    monthlyDebts,
    creditScore,
    transactionType,
    loanAmount,
    loanTermMonths,
    interestRate,
    propertyValue,
    purchasePrice,
  } = input;

  // 1. GMI
  const gmi = calculateGMI(annualIncome);

  // 2. Monthly rate and total payments
  const monthlyRate = interestRate / 12;
  const totalPayments = loanTermMonths;

  // 3. PI
  const pi = calculatePI(loanAmount, monthlyRate, totalPayments);

  // 4. Monthly components (need preliminary LTV for MI)
  const qv = calculateQV(transactionType, propertyValue, purchasePrice);
  const preliminaryLtv = calculateLTV(loanAmount, qv);

  const monthlyTax = calculateMonthlyPropertyTax(propertyValue);
  const monthlyInsurance = calculateMonthlyInsurance();
  const monthlyHOA = MONTHLY_HOA;
  const monthlyMI = calculateMonthlyMI(loanAmount, preliminaryLtv);

  // 5. PHE
  const phe = calculatePHE(pi, monthlyTax, monthlyInsurance, monthlyHOA, monthlyMI);

  // 6. TMD
  const tmd = phe + monthlyDebts;

  // 7. QV already calculated above

  // 8. LTV, front-end ratio, DTI
  const ltvPercent = preliminaryLtv;
  const frontEndPercent = calculateFrontEndRatio(phe, gmi);
  const dtiPercent = calculateDTI(tmd, gmi);

  // 9. Down payment
  const downPayment =
    transactionType === "purchase" && purchasePrice !== null
      ? purchasePrice - loanAmount
      : 0;

  // 10. AVA and RFC
  const ava = calculateAVA(downPayment, phe);
  const rfc = calculateRFC(loanAmount);

  // 11. Reserve months
  const reserveMonths = calculateReserveMonths(ava, rfc, phe);

  // 12. Qualification tests
  const failedTests: string[] = [];

  if (dtiPercent > MAX_DTI * 100) {
    failedTests.push("DTI exceeds maximum (43%)");
  }
  if (frontEndPercent > MAX_FRONT_END * 100) {
    failedTests.push("Front-end ratio exceeds maximum (28%)");
  }
  if (ltvPercent > MAX_LTV * 100) {
    failedTests.push("LTV exceeds maximum (97%)");
  }
  if (creditScore < MIN_CREDIT_SCORE) {
    failedTests.push("Credit score below minimum (620)");
  }
  if (reserveMonths < REQUIRED_RESERVE_MONTHS) {
    failedTests.push("Insufficient reserves (need 2 months)");
  }
  if (ava < rfc) {
    failedTests.push("Insufficient funds to close");
  }

  // 13. Return result
  return {
    gmi,
    phe,
    tmd,
    frontEndPercent,
    dtiPercent,
    ltvPercent,
    reserveMonths,
    creditScore,
    qualified: failedTests.length === 0,
    failedTests,
    calculatedAt: new Date().toISOString(),
  };
}
