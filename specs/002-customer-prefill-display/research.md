# Research: Customer Prefill & Display

**Feature**: 002-customer-prefill-display
**Date**: 2026-03-25

## Decision 1: Seed Data Strategy

**Decision**: Use a SQLite migration (version 3) that creates the `customers` table and inserts seed data atomically in a single transaction.

**Rationale**: The existing migration system in `src/lib/db.ts` uses `user_version` pragma for versioning. Adding migration v3 keeps this pattern consistent. Wrapping INSERT statements in a transaction ensures atomicity per FR edge case requirement ("either all seed records are inserted or none are").

**Alternatives considered**:
- Separate seed script run on first launch — rejected: adds complexity, harder to make atomic, not integrated with existing migration system.
- JSON file loaded at startup — rejected: requires runtime file I/O, doesn't leverage existing migration infrastructure.

## Decision 2: Idempotent Seed Data (FR-003)

**Decision**: Check if any rows exist in the `customers` table before inserting seed data. If the table already has data, skip seeding entirely.

**Rationale**: FR-003 states the system MUST NOT re-insert seed data if customer records already exist. A simple `SELECT COUNT(*) FROM customers` check before the INSERT block is the simplest approach. This runs within the migration transaction.

**Alternatives considered**:
- INSERT OR IGNORE with unique constraint — rejected: would silently skip individual duplicates but still attempt inserts, and wouldn't handle the "no duplication at all" requirement cleanly.
- Separate `seed_applied` flag table — rejected: over-engineering per YAGNI principle.

## Decision 3: Customer Data Source

**Decision**: Extract customer names from the user's 5 loan application documents (John Carter, Melissa Grant, Robert Hayes, Sophia Nguyen, Daniel Brooks) and generate realistic synthetic contact details (email, phone, address). Add 5 additional synthetic customers to meet the FR-002 minimum of 10.

**Rationale**: The user provided loan application documents with applicant names. Using these as the basis for seed customers creates consistency between the customer directory and loan applications. Angela Hayes (co-borrower in doc 3) will be added as a separate customer record.

**Alternatives considered**:
- Use only the 5 provided names — rejected: FR-002 requires at least 10 seed customers.
- Generate all 10 randomly — rejected: user explicitly provided data to use.

## Decision 4: Customer Selection UI (US3 — Autofill)

**Decision**: Add a searchable dropdown/combobox above the loan application form that fetches customers from `GET /api/customers` and auto-populates the applicant name and email fields on selection.

**Rationale**: The existing `loan-form.tsx` has separate state for `applicantName` and `applicantEmail`. Adding a customer selector that sets these values keeps the form structure intact. Fields remain editable after auto-population per FR-007.

**Alternatives considered**:
- Modal popup for customer selection — rejected: heavier UX for a simple selection task.
- Inline autocomplete on the name field — rejected: doesn't clearly present all available customers.

## Decision 5: Customer API Design

**Decision**: Two new GET endpoints: `GET /api/customers` (list all) and `GET /api/customers/:id` (detail). No POST/PUT/DELETE since customers are read-only in v1.

**Rationale**: Matches the existing API pattern from feature 001 (`/api/applications`). The list endpoint returns summary data (id, name, email) while the detail endpoint returns all fields. This separation supports both the directory list view and the full profile view.

**Alternatives considered**:
- Single endpoint returning all fields for all customers — rejected: wasteful for list view with many customers; spec mentions up to 100 customers.

## Decision 6: Navigation Update

**Decision**: Add "Customers" link to the existing navigation bar in `src/app/layout.tsx`.

**Rationale**: The customer directory needs to be accessible from anywhere in the app. The existing nav has Apply, Check Status, and Officer Review. Adding Customers maintains the same pattern. SC-002 requires finding any customer's profile in under 3 clicks from home.

**Alternatives considered**:
- Separate navigation section — rejected: unnecessary complexity for a single link.
