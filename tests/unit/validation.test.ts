import { describe, it, expect } from "vitest";
import { validateApplicationInput } from "@/lib/validation";

const validInput = {
  applicantName: "Jane Doe",
  applicantEmail: "jane@example.com",
  annualIncome: 85000,
  monthlyDebts: 400,
  creditScore: 720,
  transactionType: "purchase",
  loanAmount: 300000,
  loanTermMonths: 360,
  interestRate: 0.065,
  propertyValue: 350000,
  purchasePrice: 340000,
};

describe("validateApplicationInput", () => {
  it("accepts valid purchase application", () => {
    const result = validateApplicationInput(validInput);
    expect(result).toEqual({ valid: true, errors: {} });
  });

  it("accepts valid refinance application", () => {
    const result = validateApplicationInput({
      ...validInput,
      transactionType: "refinance",
      purchasePrice: null,
    });
    expect(result.valid).toBe(true);
  });

  it("rejects missing name", () => {
    const result = validateApplicationInput({
      ...validInput,
      applicantName: "",
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty("applicantName");
  });

  it("rejects invalid email", () => {
    const result = validateApplicationInput({
      ...validInput,
      applicantEmail: "notanemail",
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty("applicantEmail");
  });

  it("rejects zero income", () => {
    const result = validateApplicationInput({
      ...validInput,
      annualIncome: 0,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty("annualIncome");
  });

  it("rejects negative debts", () => {
    const result = validateApplicationInput({
      ...validInput,
      monthlyDebts: -100,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty("monthlyDebts");
  });

  it("rejects credit score below 300", () => {
    const result = validateApplicationInput({
      ...validInput,
      creditScore: 299,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty("creditScore");
  });

  it("rejects credit score above 850", () => {
    const result = validateApplicationInput({
      ...validInput,
      creditScore: 851,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty("creditScore");
  });

  it("rejects invalid transaction type", () => {
    const result = validateApplicationInput({
      ...validInput,
      transactionType: "other",
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty("transactionType");
  });

  it("rejects loan amount below 1000", () => {
    const result = validateApplicationInput({
      ...validInput,
      loanAmount: 999,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty("loanAmount");
  });

  it("rejects loan amount above 500000", () => {
    const result = validateApplicationInput({
      ...validInput,
      loanAmount: 500001,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty("loanAmount");
  });

  it("rejects term below 6", () => {
    const result = validateApplicationInput({
      ...validInput,
      loanTermMonths: 5,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty("loanTermMonths");
  });

  it("rejects term above 360", () => {
    const result = validateApplicationInput({
      ...validInput,
      loanTermMonths: 361,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty("loanTermMonths");
  });

  it("rejects interest rate below 0.001", () => {
    const result = validateApplicationInput({
      ...validInput,
      interestRate: 0.0009,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty("interestRate");
  });

  it("rejects interest rate above 0.20", () => {
    const result = validateApplicationInput({
      ...validInput,
      interestRate: 0.21,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty("interestRate");
  });

  it("rejects zero property value", () => {
    const result = validateApplicationInput({
      ...validInput,
      propertyValue: 0,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty("propertyValue");
  });

  it("requires purchase price for purchase type", () => {
    const result = validateApplicationInput({
      ...validInput,
      purchasePrice: null,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty("purchasePrice");
  });

  it("ignores purchase price for refinance type", () => {
    const result = validateApplicationInput({
      ...validInput,
      transactionType: "refinance",
      purchasePrice: null,
    });
    expect(result.valid).toBe(true);
  });

  it("handles non-object input", () => {
    const result = validateApplicationInput(null as any);
    expect(result.valid).toBe(false);
    expect(Object.keys(result.errors).length).toBeGreaterThanOrEqual(1);
  });

  it("collects multiple errors", () => {
    const result = validateApplicationInput({
      applicantName: "",
      annualIncome: -1,
      creditScore: 200,
    } as any);
    expect(result.valid).toBe(false);
    expect(Object.keys(result.errors).length).toBeGreaterThanOrEqual(2);
  });
});
