import { describe, it, expect } from "vitest";
import { seedCustomers } from "@/lib/seed-data";

describe("seedCustomers", () => {
  it("contains exactly 10 customers", () => {
    expect(seedCustomers).toHaveLength(10);
  });

  it("has all fields populated for every customer", () => {
    const fields = [
      "fullName",
      "email",
      "phone",
      "street",
      "city",
      "state",
      "zipCode",
    ] as const;

    for (const customer of seedCustomers) {
      for (const field of fields) {
        expect(customer[field], `${customer.fullName} missing ${field}`).toBeTruthy();
        expect(customer[field].trim(), `${customer.fullName} has empty ${field}`).not.toBe("");
      }
    }
  });

  it("has unique emails for every customer", () => {
    const emails = seedCustomers.map((c) => c.email);
    const uniqueEmails = new Set(emails);
    expect(uniqueEmails.size).toBe(emails.length);
  });

  it("has valid email format (contains @) for every customer", () => {
    for (const customer of seedCustomers) {
      expect(customer.email, `${customer.fullName} email missing @`).toContain("@");
    }
  });
});
