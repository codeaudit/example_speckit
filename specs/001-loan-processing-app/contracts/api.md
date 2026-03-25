# API Contracts: Loan Processing Application

**Date**: 2026-03-25
**Branch**: `001-loan-processing-app`

All endpoints are Next.js Route Handlers under `src/app/api/`.
Requests and responses use JSON. All error responses follow a
consistent shape.

## Error Response Shape

```json
{
  "error": "Human-readable message",
  "fields": {
    "fieldName": "Specific validation error"
  }
}
```

`fields` is only present for validation errors (400).

---

## POST /api/applications

Create a new loan application.

### Request Body

```json
{
  "applicantName": "Jane Doe",
  "applicantEmail": "jane@example.com",
  "annualIncome": 85000,
  "monthlyDebts": 400,
  "creditScore": 720,
  "transactionType": "purchase",
  "loanAmount": 300000,
  "loanTermMonths": 360,
  "interestRate": 0.065,
  "propertyValue": 350000,
  "purchasePrice": 340000
}
```

- `purchasePrice` required when `transactionType` is `"purchase"`,
  omitted or null for `"refinance"`.
- `interestRate` as decimal (6.5% = 0.065).

### Response 201

```json
{
  "id": 1,
  "referenceNumber": "LN-A1B2C3D4",
  "status": "Pending",
  "qualificationData": {
    "gmi": 7083.33,
    "phe": 1920.45,
    "tmd": 2320.45,
    "frontEndPercent": 27.12,
    "dtiPercent": 32.76,
    "ltvPercent": 88.24,
    "reserveMonths": 3.80,
    "creditScore": 720,
    "qualified": true,
    "failedTests": [],
    "calculatedAt": "2026-03-25T10:30:00.000Z"
  },
  "createdAt": "2026-03-25T10:30:00.000Z"
}
```

### Response 400

Validation failure. Body includes `fields` map.

---

## GET /api/applications

List applications. Supports optional `status` query parameter.

### Query Parameters

| Param  | Type   | Default   | Description                          |
|--------|--------|-----------|--------------------------------------|
| status | string | "Pending" | Filter by status: Pending, Approved, Rejected, or "all" |

### Response 200

```json
{
  "applications": [
    {
      "id": 1,
      "referenceNumber": "LN-A1B2C3D4",
      "applicantName": "Jane Doe",
      "loanAmount": 300000,
      "transactionType": "purchase",
      "qualified": true,
      "status": "Pending",
      "createdAt": "2026-03-25T10:30:00.000Z"
    }
  ]
}
```

---

## GET /api/applications/[id]

Get full application detail including qualification data and
decision (if exists).

### Response 200

```json
{
  "id": 1,
  "referenceNumber": "LN-A1B2C3D4",
  "applicantName": "Jane Doe",
  "applicantEmail": "jane@example.com",
  "annualIncome": 85000,
  "monthlyDebts": 400,
  "creditScore": 720,
  "transactionType": "purchase",
  "loanAmount": 300000,
  "loanTermMonths": 360,
  "interestRate": 0.065,
  "propertyValue": 350000,
  "purchasePrice": 340000,
  "status": "Pending",
  "qualificationData": {
    "gmi": 7083.33,
    "phe": 1920.45,
    "tmd": 2320.45,
    "frontEndPercent": 27.12,
    "dtiPercent": 32.76,
    "ltvPercent": 88.24,
    "reserveMonths": 3.80,
    "creditScore": 720,
    "qualified": true,
    "failedTests": [],
    "calculatedAt": "2026-03-25T10:30:00.000Z"
  },
  "decision": null,
  "createdAt": "2026-03-25T10:30:00.000Z"
}
```

When a decision exists:

```json
{
  "decision": {
    "decisionType": "Approved",
    "decisionNote": "Strong income, good credit history.",
    "isOverride": false,
    "decidedAt": "2026-03-25T11:00:00.000Z"
  }
}
```

### Response 404

Application not found.

---

## POST /api/applications/[id]/decide

Record a decision on a pending application.

### Request Body

```json
{
  "decisionType": "Approved",
  "decisionNote": "Strong income, good credit history."
}
```

- `decisionType`: `"Approved"` or `"Rejected"` (required)
- `decisionNote`: string (optional, may be null or omitted)

### Response 200

```json
{
  "id": 1,
  "referenceNumber": "LN-A1B2C3D4",
  "status": "Approved",
  "decision": {
    "decisionType": "Approved",
    "decisionNote": "Strong income, good credit history.",
    "isOverride": false,
    "decidedAt": "2026-03-25T11:00:00.000Z"
  }
}
```

`isOverride` is `true` when `decisionType` contradicts
`qualificationData.qualified` (e.g., approving a non-qualified
application).

### Response 400

Invalid decision type or missing required fields.

### Response 409

Application already has a decision (FR-007).

```json
{
  "error": "Application has already been decided"
}
```

---

## GET /api/applications?ref=[referenceNumber]

Lookup by reference number (used by borrower status page).

### Query Parameters

| Param | Type   | Description                |
|-------|--------|----------------------------|
| ref   | string | Reference number to search |

### Response 200

Returns matching application (same shape as GET /api/applications/[id]
but without full qualification breakdown — borrower sees status and
decision note only).

```json
{
  "id": 1,
  "referenceNumber": "LN-A1B2C3D4",
  "applicantName": "Jane Doe",
  "loanAmount": 300000,
  "transactionType": "purchase",
  "status": "Approved",
  "decision": {
    "decisionType": "Approved",
    "decisionNote": "Strong income, good credit history.",
    "decidedAt": "2026-03-25T11:00:00.000Z"
  },
  "createdAt": "2026-03-25T10:30:00.000Z"
}
```

### Response 404

No application found with that reference number.
