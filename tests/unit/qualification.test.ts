import { describe, it, expect } from "vitest";
import {
  calculateGMI,
  calculatePI,
  calculatePHE,
  calculateQV,
  calculateLTV,
  calculateFrontEndRatio,
  calculateDTI,
  calculateReserveMonths,
  evaluateQualification,
} from "@/lib/qualification";

describe("calculateGMI", () => {
  it("derives gross monthly income from annual", () => {
    expect(calculateGMI(84000)).toBe(7000);
  });
});

describe("calculatePI", () => {
  it("calculates monthly P&I for 30-year loan", () => {
    const result = calculatePI(300000, 0.065 / 12, 360);
    expect(result).toBeCloseTo(1896.2, 0);
  });

  it("calculates monthly P&I for 15-year loan", () => {
    const result = calculatePI(200000, 0.05 / 12, 180);
    expect(result).toBeCloseTo(1581.59, 0);
  });

  it("handles zero interest rate", () => {
    const result = calculatePI(120000, 0, 360);
    expect(result).toBeCloseTo(333.33, 2);
  });
});

describe("calculatePHE", () => {
  it("sums all housing expense components", () => {
    expect(calculatePHE(1900, 350, 100, 0, 125)).toBe(2475);
  });
});

describe("calculateQV", () => {
  it("returns min(PP, PV) for purchase", () => {
    expect(calculateQV("purchase", 400000, 380000)).toBe(380000);
  });

  it("returns PV for refinance", () => {
    expect(calculateQV("refinance", 400000, null)).toBe(400000);
  });

  it("returns PV when PV < PP for purchase", () => {
    expect(calculateQV("purchase", 350000, 380000)).toBe(350000);
  });
});

describe("calculateLTV", () => {
  it("calculates LTV percentage", () => {
    expect(calculateLTV(270000, 300000)).toBe(90);
  });
});

describe("calculateFrontEndRatio", () => {
  it("calculates front-end ratio", () => {
    const result = calculateFrontEndRatio(1960, 7000);
    expect(result).toBeCloseTo(28.0, 1);
  });
});

describe("calculateDTI", () => {
  it("calculates debt-to-income ratio", () => {
    const result = calculateDTI(3010, 7000);
    expect(result).toBeCloseTo(43.0, 0);
  });
});

describe("calculateReserveMonths", () => {
  it("calculates reserve months", () => {
    expect(calculateReserveMonths(50000, 9000, 2000)).toBe(20.5);
  });

  it("handles zero PHE", () => {
    expect(calculateReserveMonths(50000, 9000, 0)).toBe(Infinity);
  });
});

describe("evaluateQualification", () => {
  it("qualifies a good application", () => {
    const result = evaluateQualification({
      annualIncome: 120000,
      monthlyDebts: 500,
      creditScore: 750,
      transactionType: "purchase",
      loanAmount: 300000,
      loanTermMonths: 360,
      interestRate: 0.065,
      propertyValue: 400000,
      purchasePrice: 400000,
    });
    expect(result.qualified).toBe(true);
    expect(result.failedTests).toEqual([]);
  });

  it("fails application with low credit score", () => {
    const result = evaluateQualification({
      annualIncome: 120000,
      monthlyDebts: 500,
      creditScore: 580,
      transactionType: "purchase",
      loanAmount: 300000,
      loanTermMonths: 360,
      interestRate: 0.065,
      propertyValue: 400000,
      purchasePrice: 400000,
    });
    expect(result.qualified).toBe(false);
    expect(result.failedTests).toContain("Credit score below minimum (620)");
  });

  it("fails application with high DTI", () => {
    const result = evaluateQualification({
      annualIncome: 36000,
      monthlyDebts: 800,
      creditScore: 720,
      transactionType: "purchase",
      loanAmount: 300000,
      loanTermMonths: 360,
      interestRate: 0.065,
      propertyValue: 400000,
      purchasePrice: 400000,
    });
    expect(result.qualified).toBe(false);
    expect(result.failedTests).toContain("DTI exceeds maximum (43%)");
  });

  it("collects multiple failures", () => {
    const result = evaluateQualification({
      annualIncome: 24000,
      monthlyDebts: 500,
      creditScore: 580,
      transactionType: "purchase",
      loanAmount: 390000,
      loanTermMonths: 360,
      interestRate: 0.065,
      propertyValue: 400000,
      purchasePrice: 400000,
    });
    expect(result.qualified).toBe(false);
    expect(result.failedTests.length).toBeGreaterThanOrEqual(2);
  });

  it("handles refinance transaction", () => {
    const result = evaluateQualification({
      annualIncome: 120000,
      monthlyDebts: 500,
      creditScore: 750,
      transactionType: "refinance",
      loanAmount: 300000,
      loanTermMonths: 360,
      interestRate: 0.065,
      propertyValue: 400000,
      purchasePrice: null,
    });
    expect(result.ltvPercent).toBe((300000 / 400000) * 100);
  });
});
