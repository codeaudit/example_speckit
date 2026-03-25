import { describe, it, expect } from "vitest";
import {
  calculateMonthlyPropertyTax,
  calculateMonthlyInsurance,
  calculateMonthlyMI,
  calculateAVA,
  calculateRFC,
  PROPERTY_TAX_RATE,
  MAX_DTI,
  MIN_CREDIT_SCORE,
} from "@/lib/defaults";

describe("calculateMonthlyPropertyTax", () => {
  it("calculates monthly tax from property value", () => {
    expect(calculateMonthlyPropertyTax(400000)).toBe(
      (400000 * 0.012) / 12
    );
    expect(calculateMonthlyPropertyTax(400000)).toBe(400);
  });
});

describe("calculateMonthlyInsurance", () => {
  it("returns monthly insurance amount", () => {
    expect(calculateMonthlyInsurance()).toBe(100);
  });
});

describe("calculateMonthlyMI", () => {
  it("returns MI when LTV > 80%", () => {
    expect(calculateMonthlyMI(300000, 90)).toBe((300000 * 0.005) / 12);
    expect(calculateMonthlyMI(300000, 90)).toBe(125);
  });

  it("returns 0 when LTV <= 80%", () => {
    expect(calculateMonthlyMI(300000, 75)).toBe(0);
  });

  it("returns 0 when LTV exactly 80%", () => {
    expect(calculateMonthlyMI(300000, 80)).toBe(0);
  });
});

describe("calculateAVA", () => {
  it("calculates available verified assets", () => {
    const result = calculateAVA(60000, 2000);
    expect(result).toBe(72000);
  });
});

describe("calculateRFC", () => {
  it("calculates required funds to close", () => {
    expect(calculateRFC(300000)).toBe(9000);
  });
});

describe("constants", () => {
  it("has correct threshold values", () => {
    expect(PROPERTY_TAX_RATE).toBe(0.012);
    expect(MAX_DTI).toBe(0.43);
    expect(MIN_CREDIT_SCORE).toBe(620);
  });
});
