# API Contracts: Customer Prefill & Display

**Feature**: 002-customer-prefill-display
**Date**: 2026-03-25

## Endpoints

### GET /api/customers

List all customers (summary view for directory and selection).

**Query Parameters**: None (all customers returned; spec says up to 100 without pagination)

**Response 200**:
```json
{
  "customers": [
    {
      "id": 1,
      "fullName": "John Carter",
      "email": "john.carter@email.com"
    }
  ]
}
```

**Response shape**: `{ customers: CustomerSummary[] }`

---

### GET /api/customers/:id

Get full customer profile.

**Path Parameters**: `id` — customer ID (integer)

**Response 200**:
```json
{
  "id": 1,
  "fullName": "John Carter",
  "email": "john.carter@email.com",
  "phone": "(555) 201-1001",
  "street": "742 Evergreen Terrace",
  "city": "Springfield",
  "state": "IL",
  "zipCode": "62704",
  "createdAt": "2026-03-25T00:00:00.000Z"
}
```

**Response 404**:
```json
{
  "error": "Customer not found"
}
```

**Response shape**: `Customer` or `ApiError`

---

## Integration with Existing Endpoints

### Loan Form Autofill Flow

1. Client fetches `GET /api/customers` to populate the customer selector
2. User selects a customer from the list
3. Client auto-populates `applicantName` and `applicantEmail` fields in the loan form
4. User may edit the auto-populated fields (FR-007)
5. Form submits to existing `POST /api/applications` — no changes needed to this endpoint

**No changes required** to existing `/api/applications` endpoints. The customer selection is purely a client-side form enhancement.

## Error Response Shape

Uses existing `ApiError` type:
```typescript
{
  error: string;
  fields?: Record<string, string>;
}
```
