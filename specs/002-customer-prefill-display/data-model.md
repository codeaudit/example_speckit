# Data Model: Customer Prefill & Display

**Feature**: 002-customer-prefill-display
**Date**: 2026-03-25

## Entities

### Customer

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique identifier |
| full_name | TEXT | NOT NULL | Customer's full name |
| email | TEXT | NOT NULL UNIQUE | Email address (unique per edge case) |
| phone | TEXT | NOT NULL | Phone number |
| street | TEXT | NOT NULL | Street address |
| city | TEXT | NOT NULL | City |
| state | TEXT | NOT NULL | State (2-letter code) |
| zip_code | TEXT | NOT NULL | ZIP code |
| created_at | TEXT | NOT NULL DEFAULT (datetime('now')) | Record creation timestamp |

**Notes**:
- Email uniqueness enforced at DB level per edge case requirement
- No foreign key to `loan_applications` — customers are independent entities (per assumptions)
- The loan form autofill uses customer name + email to populate application fields (soft link, not FK)

## Migration v3: customers table + seed data

```sql
CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

Seed data insertion (within same migration, wrapped in transaction, skipped if table already has rows):

## Seed Data (10 Customers)

Customers 1-5 derived from user-provided loan application documents. Customers 6-10 are additional synthetic records.

| # | Full Name | Email | Phone | Street | City | State | ZIP |
|---|-----------|-------|-------|--------|------|-------|-----|
| 1 | John Carter | john.carter@email.com | (555) 201-1001 | 742 Evergreen Terrace | Springfield | IL | 62704 |
| 2 | Melissa Grant | melissa.grant@email.com | (555) 201-1002 | 1024 Oak Avenue | Portland | OR | 97205 |
| 3 | Robert Hayes | robert.hayes@email.com | (555) 201-1003 | 315 Maple Drive | Austin | TX | 78701 |
| 4 | Sophia Nguyen | sophia.nguyen@email.com | (555) 201-1004 | 890 Cherry Lane | San Jose | CA | 95112 |
| 5 | Daniel Brooks | daniel.brooks@email.com | (555) 201-1005 | 456 Pine Street | Denver | CO | 80202 |
| 6 | Angela Hayes | angela.hayes@email.com | (555) 201-1006 | 315 Maple Drive | Austin | TX | 78701 |
| 7 | Marcus Chen | marcus.chen@email.com | (555) 201-1007 | 2200 Lakeview Boulevard | Seattle | WA | 98101 |
| 8 | Priya Patel | priya.patel@email.com | (555) 201-1008 | 178 Willow Court | Charlotte | NC | 28202 |
| 9 | James Whitfield | james.whitfield@email.com | (555) 201-1009 | 503 Birch Road | Nashville | TN | 37203 |
| 10 | Laura Kim | laura.kim@email.com | (555) 201-1010 | 67 Cedar Avenue | Boston | MA | 02101 |

**Notes**:
- Angela Hayes (customer 6) shares address with Robert Hayes (customer 3) — she was the co-borrower in loan application document 3
- All emails are unique per edge case requirement
- All phone numbers use synthetic (555) prefix
- All data is fictional per assumption that no real personal data is used

## TypeScript Types

```typescript
export interface Customer {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  createdAt: string;
}

export interface CustomerSummary {
  id: number;
  fullName: string;
  email: string;
}
```

## Relationship to Existing Entities

- **Customer → LoanApplication**: No foreign key. The loan form autofill copies `customer.fullName` → `applicantName` and `customer.email` → `applicantEmail` at form-fill time. This is a soft reference per spec assumptions.
- **Customer is independent**: A customer existing does not imply a loan application exists, and vice versa.
