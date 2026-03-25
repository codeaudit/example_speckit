# Data Model: Enhanced Officer Workflow

**Feature**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)
**Date**: 2026-03-25

## Schema Changes

**None.** This feature uses existing tables with no modifications. The customer-to-application relationship is established at query time via email matching.

## Entity Relationships

```text
customers (existing)          loan_applications (existing)
┌──────────────────┐         ┌──────────────────────────┐
│ id (PK)          │         │ id (PK)                  │
│ full_name        │         │ reference_number (UNIQUE) │
│ email (UNIQUE)   │◄─ JOIN ─│ applicant_email           │
│ phone            │  (email)│ applicant_name            │
│ address_street   │         │ loan_amount               │
│ address_city     │         │ property_value             │
│ address_state    │         │ transaction_type           │
│ address_zip      │         │ status                     │
│ created_at       │         │ qualification_data (JSON)  │
└──────────────────┘         │ created_at                 │
                             └──────────────────────────┘
                                       │
                                       │ 1:0-1
                                       ▼
                             ┌──────────────────────────┐
                             │ decisions (existing)       │
                             │ id (PK)                   │
                             │ application_id (UNIQUE FK)│
                             │ decision_type             │
                             │ decision_note             │
                             │ is_override               │
                             │ decided_at                │
                             └──────────────────────────┘
```

### Relationship: Customer → Loan Applications

- **Type**: One-to-many (via email match)
- **Join condition**: `customers.email = loan_applications.applicant_email`
- **Cardinality**: A customer may have 0..N applications. An application matches 0..1 customers.
- **No foreign key**: The relationship is soft — matched at query time only
- **Edge case**: If a customer's email doesn't match any application's `applicant_email`, the customer has zero applications. If an application's email doesn't match any customer, it has no customer association (but still appears in the flat application list).

### Existing Relationship: Application → Decision

- **Type**: One-to-zero-or-one (FK: `decisions.application_id`)
- **No changes** — decision flow is reused as-is

## TypeScript Types

### New Types

```typescript
// Extended customer summary with application count (for officer list)
interface CustomerWithAppCount extends CustomerSummary {
  applicationCount: number;
}

// Application summary for customer view (subset of ApplicationDetail)
interface CustomerApplication {
  id: string;
  referenceNumber: string;
  loanAmount: number;
  transactionType: string;
  status: "Pending" | "Approved" | "Rejected";
  qualificationStatus: "Qualified" | "Not Qualified" | "N/A";
  createdAt: string;
}
```

### Existing Types (unchanged)

- `Customer` — full profile (id, fullName, email, phone, address fields, createdAt)
- `CustomerSummary` — list view (id, fullName, email)
- `LoanApplication` — full application record
- `ApplicationDetail` — application + qualification + decision
- `Decision` — officer decision record

## Query Patterns

### Get applications for a customer (new)

```sql
SELECT
  la.id,
  la.reference_number,
  la.loan_amount,
  la.transaction_type,
  la.status,
  la.qualification_data,
  la.created_at
FROM loan_applications la
INNER JOIN customers c ON la.applicant_email = c.email
WHERE c.id = ?
ORDER BY la.created_at DESC
```

### Get customers with application counts (enhanced)

```sql
SELECT
  c.id,
  c.full_name,
  c.email,
  (SELECT COUNT(*) FROM loan_applications la WHERE la.applicant_email = c.email) AS application_count
FROM customers c
ORDER BY c.full_name ASC
```

## State Management

### Theme State (new, in-memory only)

```typescript
interface ThemeState {
  theme: "light" | "dark";
  isManualOverride: boolean;
}
```

- **Initial state**: `{ theme: <system preference>, isManualOverride: false }`
- **After toggle**: `{ theme: <opposite>, isManualOverride: true }`
- **On page navigation**: State preserved via React context (SPA navigation)
- **On tab close/reload**: State lost (session-only, no persistence)
