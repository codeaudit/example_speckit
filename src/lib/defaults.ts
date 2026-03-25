// Hardcoded defaults and qualification thresholds per FR-014/FR-015

export const PROPERTY_TAX_RATE = 0.012;
export const ANNUAL_INSURANCE = 1200;
export const MONTHLY_HOA = 0;
export const MI_RATE = 0.005;
export const RFC_RATE = 0.03;
export const REQUIRED_RESERVE_MONTHS = 2;
export const MAX_DTI = 0.43;
export const MAX_FRONT_END = 0.28;
export const MAX_LTV = 0.97;
export const MIN_CREDIT_SCORE = 620;

export function calculateMonthlyPropertyTax(propertyValue: number): number {
  return (propertyValue * PROPERTY_TAX_RATE) / 12;
}

export function calculateMonthlyInsurance(): number {
  return ANNUAL_INSURANCE / 12;
}

export function calculateMonthlyMI(loanAmount: number, ltvPercent: number): number {
  if (ltvPercent > 80) {
    return (loanAmount * MI_RATE) / 12;
  }
  return 0;
}

export function calculateAVA(downPayment: number, estimatedPHE: number): number {
  return downPayment + 6 * estimatedPHE;
}

export function calculateRFC(loanAmount: number): number {
  return loanAmount * RFC_RATE;
}
