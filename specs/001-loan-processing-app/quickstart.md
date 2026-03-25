# Quickstart: Loan Processing Application

**Date**: 2026-03-25
**Branch**: `001-loan-processing-app`

## Prerequisites

- Node.js 20+ (LTS)
- npm 10+

## Setup

```bash
# Clone and enter the project
cd example_speckit

# Install dependencies
npm install

# Run database migrations (automatic on first start)
# SQLite file created at ./data/loan-app.db

# Start development server
npm run dev
```

The app starts at `http://localhost:3000`.

## Usage

### As a Borrower

1. Navigate to `http://localhost:3000/apply`
2. Fill in the loan application form:
   - Personal info: name, email
   - Financial: annual income, existing monthly debts, credit score
   - Loan details: transaction type (purchase/refinance), loan
     amount, term, interest rate
   - Property: property value (and purchase price for purchase
     transactions)
3. Submit the form
4. Note the reference number on the confirmation screen

### Check Application Status

1. Navigate to `http://localhost:3000/status`
2. Enter your reference number
3. View your application status and any decision notes

### As a Loan Officer

1. Navigate to `http://localhost:3000/officer`
2. View the list of pending applications
3. Click an application to see full details and the qualification
   summary (GMI, DTI%, LTV%, etc.)
4. Approve or reject with an optional note

## Testing

```bash
# Run all tests
npm test

# Run unit tests only
npm test -- --dir tests/unit

# Run integration tests only
npm test -- --dir tests/integration

# Run tests in watch mode
npm test -- --watch
```

## Project Structure

```
src/
├── app/           # Next.js pages and API routes
├── lib/           # Business logic (qualification, DB, validation)
├── components/    # React components
└── types/         # TypeScript type definitions

tests/
├── unit/          # Pure function tests (qualification, validation)
└── integration/   # API route tests with real SQLite
```

## Key Files

| File                        | Purpose                              |
|-----------------------------|--------------------------------------|
| `src/lib/qualification.ts`  | Mortgage qualification engine        |
| `src/lib/db.ts`             | SQLite connection + migrations       |
| `src/lib/validation.ts`     | Input validation (shared client/server) |
| `src/lib/defaults.ts`       | Hardcoded defaults and thresholds    |

## Environment

No environment variables required. SQLite database is created
automatically in `./data/` on first run.
