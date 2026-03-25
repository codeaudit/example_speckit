# Data Model: Loan Processing Application

**Date**: 2026-03-25
**Branch**: `001-loan-processing-app`

## Entity Relationship

```
┌──────────────────────┐       ┌──────────────────────┐
│   loan_applications  │       │      decisions        │
├──────────────────────┤       ├──────────────────────┤
│ id (PK)              │       │ id (PK)              │
│ reference_number (U) │◄──────│ application_id (FK)  │
│ applicant_name       │  1:0-1│ decision_type        │
│ applicant_email      │       │ decision_note        │
│ annual_income        │       │ is_override          │
│ monthly_debts        │       │ decided_at           │
│ credit_score         │       └──────────────────────┘
│ transaction_type     │
│ loan_amount          │
│ loan_term_months     │
│ interest_rate        │
│ property_value       │
│ purchase_price       │
│ status               │
│ qualification_data   │
│ created_at           │
└──────────────────────┘
```

## Tables

### loan_applications

| Column            | Type    | Constraints                        | Notes                                    |
|-------------------|---------|------------------------------------|------------------------------------------|
| id                | INTEGER | PRIMARY KEY AUTOINCREMENT          | Internal ID                              |
| reference_number  | TEXT    | NOT NULL UNIQUE                    | Format: LN-XXXXXXXX                     |
| applicant_name    | TEXT    | NOT NULL                           |                                          |
| applicant_email   | TEXT    | NOT NULL                           | Valid email format                       |
| annual_income     | REAL    | NOT NULL, CHECK(> 0)               | Used to derive GMI = annual_income / 12  |
| monthly_debts     | REAL    | NOT NULL, CHECK(>= 0)              | Existing recurring monthly debts         |
| credit_score      | INTEGER | NOT NULL, CHECK(300-850)           |                                          |
| transaction_type  | TEXT    | NOT NULL, CHECK(IN purchase,refinance) |                                      |
| loan_amount       | REAL    | NOT NULL, CHECK(1000-500000)       |                                          |
| loan_term_months  | INTEGER | NOT NULL, CHECK(6-360)             |                                          |
| interest_rate     | REAL    | NOT NULL, CHECK(0.001-0.20)        | Stored as decimal (e.g., 0.065 = 6.5%)  |
| property_value    | REAL    | NOT NULL, CHECK(> 0)               |                                          |
| purchase_price    | REAL    | NULL                               | Required when transaction_type=purchase  |
| status            | TEXT    | NOT NULL DEFAULT 'Pending'         | Pending, Approved, Rejected              |
| qualification_data| TEXT    | NULL                               | JSON blob of QualificationResult         |
| created_at        | TEXT    | NOT NULL DEFAULT CURRENT_TIMESTAMP | ISO 8601                                 |

### decisions

| Column          | Type    | Constraints                        | Notes                                   |
|-----------------|---------|------------------------------------|-----------------------------------------|
| id              | INTEGER | PRIMARY KEY AUTOINCREMENT          | Internal ID                             |
| application_id  | INTEGER | NOT NULL REFERENCES loan_applications(id) UNIQUE | One decision per application |
| decision_type   | TEXT    | NOT NULL, CHECK(IN Approved,Rejected) |                                      |
| decision_note   | TEXT    | NULL                               | Optional officer note                   |
| is_override     | INTEGER | NOT NULL DEFAULT 0                 | 1 if officer overrode qualification     |
| decided_at      | TEXT    | NOT NULL DEFAULT CURRENT_TIMESTAMP | ISO 8601                                |

## State Transitions

```
            ┌──────────┐
            │ Pending  │
            └────┬─────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
  ┌──────────┐     ┌──────────┐
  │ Approved │     │ Rejected │
  └──────────┘     └──────────┘
```

- **Pending → Approved**: Officer approves (with optional note).
  Status updated in loan_applications, decision row created.
- **Pending → Rejected**: Officer rejects (with optional note).
  Status updated in loan_applications, decision row created.
- **Approved/Rejected → (terminal)**: No further transitions
  allowed. FR-007 enforces immutability.

## Qualification Data (JSON Schema)

The `qualification_data` column stores the full qualification
result as a JSON string. Structure:

```json
{
  "gmi": 5000.00,
  "phe": 1450.00,
  "tmd": 1850.00,
  "frontEndPercent": 29.00,
  "dtiPercent": 37.00,
  "ltvPercent": 90.00,
  "reserveMonths": 3.2,
  "creditScore": 720,
  "qualified": true,
  "failedTests": [],
  "calculatedAt": "2026-03-25T10:30:00.000Z"
}
```

When `qualified` is `false`, `failedTests` contains strings like:
- `"DTI exceeds maximum (43%)"`
- `"Credit score below minimum (620)"`
- `"LTV exceeds maximum (97%)"`
- `"Front-end ratio exceeds maximum (28%)"`
- `"Insufficient reserves (need 2 months)"`
- `"Insufficient funds to close"`

## Validation Rules (from FR-002)

| Field            | Rule                                          |
|------------------|-----------------------------------------------|
| applicant_name   | Non-empty string                              |
| applicant_email  | Non-empty, valid email format                 |
| annual_income    | Positive number (> 0)                         |
| monthly_debts    | Zero or positive (>= 0)                       |
| credit_score     | Integer, 300–850 inclusive                    |
| transaction_type | "purchase" or "refinance"                     |
| loan_amount      | 1,000–500,000 inclusive                       |
| loan_term_months | 6–360 inclusive                               |
| interest_rate    | 0.1%–20% (stored as 0.001–0.20)              |
| property_value   | Positive number (> 0)                         |
| purchase_price   | Positive number when transaction_type=purchase; null otherwise |

## Hardcoded Defaults (from FR-014)

| Parameter              | Formula / Value                                    |
|------------------------|----------------------------------------------------|
| Monthly property taxes | property_value * 0.012 / 12                        |
| Monthly insurance      | 1200 / 12 = 100                                    |
| Monthly HOA            | 0                                                  |
| Monthly MI             | LTV > 80% ? loan_amount * 0.005 / 12 : 0          |
| Available assets (AVA) | down_payment + (estimated_PHE * 6)                 |
| Funds to close (RFC)   | loan_amount * 0.03                                 |
| Required reserves      | 2 months of PHE                                    |

## Qualification Thresholds (from FR-015)

| Threshold          | Value |
|--------------------|-------|
| Max DTI (back-end) | 43%   |
| Max Front-End      | 28%   |
| Max LTV            | 97%   |
| Min Credit Score   | 620   |
| Required Reserves  | 2 mo  |
