# API Contracts: Enhanced Officer Workflow

**Feature**: [../spec.md](../spec.md) | **Plan**: [../plan.md](../plan.md)
**Date**: 2026-03-25

## New Endpoints

### GET /api/customers/:id/applications

Returns all loan applications associated with a customer, matched by email address.

**Request**:
```
GET /api/customers/:id/applications
```

**Path Parameters**:
| Parameter | Type   | Description          |
|-----------|--------|----------------------|
| id        | string | Customer ID (nanoid) |

**Success Response** (200):
```json
{
  "applications": [
    {
      "id": "abc123",
      "referenceNumber": "LN-20260325-ABC1",
      "loanAmount": 350000,
      "transactionType": "Purchase",
      "status": "Pending",
      "qualificationStatus": "Qualified",
      "createdAt": "2026-03-25T10:30:00.000Z"
    }
  ]
}
```

**Response Fields**:
| Field               | Type   | Description                                    |
|---------------------|--------|------------------------------------------------|
| id                  | string | Application ID                                 |
| referenceNumber     | string | Unique reference number (LN-YYYYMMDD-XXXX)     |
| loanAmount          | number | Requested loan amount in dollars                |
| transactionType     | string | "Purchase" or "Refinance"                       |
| status              | string | "Pending", "Approved", or "Rejected"            |
| qualificationStatus | string | "Qualified", "Not Qualified", or "N/A"          |
| createdAt           | string | ISO 8601 timestamp                              |

**Error Responses**:

- **404 Not Found** — Customer ID does not exist
  ```json
  { "error": "Customer not found" }
  ```

- **500 Internal Server Error** — Database error
  ```json
  { "error": "Internal server error" }
  ```

**Notes**:
- Applications are matched by `customers.email = loan_applications.applicant_email`
- Results ordered by `created_at DESC` (newest first)
- Returns empty array (not 404) when customer exists but has no applications
- `qualificationStatus` is derived from `qualification_data` JSON: "Qualified" if all tests pass, "Not Qualified" if any fail, "N/A" if no qualification data

## Modified Endpoints

### GET /api/customers (enhanced)

**Change**: Add optional `applicationCount` field to each customer in the response.

**Existing Response** (unchanged for backward compatibility):
```json
{
  "customers": [
    {
      "id": "abc123",
      "fullName": "John Carter",
      "email": "john.carter@example.com"
    }
  ]
}
```

**Enhanced Response** (when `include=applicationCount` query parameter is present):
```json
{
  "customers": [
    {
      "id": "abc123",
      "fullName": "John Carter",
      "email": "john.carter@example.com",
      "applicationCount": 3
    }
  ]
}
```

**Query Parameters**:
| Parameter | Type   | Required | Description                              |
|-----------|--------|----------|------------------------------------------|
| include   | string | No       | Comma-separated list of extra fields. Supports: `applicationCount` |

**Notes**:
- Without the `include` parameter, response is identical to current behavior (backward compatible)
- `applicationCount` is computed via SQL subquery on `loan_applications.applicant_email`

## Existing Endpoints (unchanged)

The following endpoints are reused as-is:

- **GET /api/applications/:id** — Full application detail (used by officer review page)
- **POST /api/applications/:id/decide** — Submit decision (used by decision form)
- **GET /api/customers/:id** — Full customer profile (used by customer detail pages)

## Integration Test Requirements

### New API Endpoint Tests

1. **GET /api/customers/:id/applications — with matching applications**
   - Seed a customer and applications with matching email
   - Assert response contains all matching applications
   - Assert each application has correct fields and types
   - Assert applications are ordered by createdAt DESC

2. **GET /api/customers/:id/applications — no matching applications**
   - Seed a customer with no matching application emails
   - Assert response is `{ "applications": [] }` (200, not 404)

3. **GET /api/customers/:id/applications — customer not found**
   - Request with non-existent customer ID
   - Assert 404 response with error message

4. **GET /api/customers/:id/applications — qualification status derivation**
   - Seed applications with different qualification states
   - Assert "Qualified" when all tests pass
   - Assert "Not Qualified" when any test fails
   - Assert "N/A" when no qualification data

5. **GET /api/customers?include=applicationCount**
   - Assert each customer includes `applicationCount` field
   - Assert counts match actual application count per email
