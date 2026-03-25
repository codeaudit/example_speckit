# Quickstart: Customer Prefill & Display

**Feature**: 002-customer-prefill-display
**Date**: 2026-03-25

## Prerequisites

- Node.js 20+ (see `.nvmrc`)
- Feature 001 (Loan Processing App) fully implemented and working
- `npm install` completed

## Start the Application

```bash
nvm use 20
npm run dev
```

## Verification Scenarios

### Scenario 1: Seed Data Auto-Population (US2)

1. Delete the existing database: `rm -f data/loan-app.db`
2. Start the app: `npm run dev`
3. Navigate to http://localhost:3000/customers
4. **Expected**: 10 customers displayed in a list with names and emails
5. Restart the app
6. Navigate to the customer directory again
7. **Expected**: Still exactly 10 customers (no duplicates)

### Scenario 2: Customer Directory (US1)

1. Navigate to http://localhost:3000/customers
2. **Expected**: Customer list shows all 10 seed customers with name and email
3. Click on "John Carter"
4. **Expected**: Full profile page shows:
   - Name: John Carter
   - Email: john.carter@email.com
   - Phone: (555) 201-1001
   - Address: 742 Evergreen Terrace, Springfield, IL 62704

### Scenario 3: Empty Directory State (US1 Edge Case)

1. If testing with empty customers table (manually):
   - Navigate to http://localhost:3000/customers
   - **Expected**: "No customers found" message displayed

### Scenario 4: Autofill Loan Application (US3)

1. Navigate to http://localhost:3000/apply
2. **Expected**: Customer selection dropdown/search is visible above or within the form
3. Select "Melissa Grant" from the customer list
4. **Expected**: Applicant Name auto-fills with "Melissa Grant" and Email auto-fills with "melissa.grant@email.com"
5. Edit the email to "melissa.g@custom.com"
6. **Expected**: Edit is accepted — the auto-populated value is not locked
7. Submit the loan application with valid financial data
8. **Expected**: Application created successfully with the edited email

### Scenario 5: Navigation (Cross-Feature)

1. Navigate to http://localhost:3000
2. **Expected**: Home page shows a Customers card/link alongside Apply, Check Status, Officer Review
3. Click Customers
4. **Expected**: Customer directory loads within 2 seconds
5. Click any customer → view profile → use browser back → return to directory
6. **Expected**: Full profile accessible in under 3 clicks from home (SC-002)

## Test Suite

```bash
npm test
```

All existing tests from feature 001 must continue to pass, plus new tests for:
- Customer seed data migration (atomic, idempotent)
- Customer API endpoints (list, detail, 404)
- Seed data completeness (all 10 records, all fields populated)
