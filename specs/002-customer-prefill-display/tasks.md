# Tasks: Customer Prefill & Display

**Input**: Design documents from `/specs/002-customer-prefill-display/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api.md

**Tests**: Included — constitution mandates Test-First Development (NON-NEGOTIABLE).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story. US2 (Seed Data) is implemented first as it is foundational — US1 and US3 depend on customers existing in the database.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single Next.js project**: `src/` at repository root
- Tests in `tests/` at repository root
- API routes in `src/app/api/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Types and shared modules needed by all user stories

- [x] T001 Add Customer and CustomerSummary types to src/types/index.ts (fields: id, fullName, email, phone, street, city, state, zipCode, createdAt)
- [x] T002 [P] Create seed data module in src/lib/seed-data.ts with array of 10 customer records per data-model.md (John Carter, Melissa Grant, Robert Hayes, Sophia Nguyen, Daniel Brooks, Angela Hayes, Marcus Chen, Priya Patel, James Whitfield, Laura Kim)

---

## Phase 2: User Story 2 — Prefill Customer Data on Application Start (Priority: P2 — implemented first as foundational)

**Goal**: When the application starts with an empty database, the system automatically seeds the `customers` table with 10 predefined customer records. On restart, existing records are NOT duplicated.

**Independent Test**: Start the app with a fresh database → verify 10 customer records exist. Restart → verify still exactly 10 (no duplicates).

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T003 [P] [US2] Write failing unit test for seed data completeness in tests/unit/seed-data.test.ts — test cases: exactly 10 customers, all fields populated (no empty strings), all emails unique, all emails contain @
- [x] T004 [P] [US2] Write failing integration test for seed migration in tests/integration/seed.test.ts — test cases: fresh DB creates customers table with 10 rows, all seed records have complete data, restart does NOT duplicate records (idempotent), migration is atomic (all or nothing via transaction)

### Implementation for User Story 2

- [x] T005 [US2] Add migration v3 to src/lib/db.ts — CREATE TABLE customers (per data-model.md schema), insert seed data from src/lib/seed-data.ts within a transaction, skip insert if table already has rows (idempotent per FR-003)
- [x] T006 [US2] Verify T003 and T004 tests pass

**Checkpoint**: Seed data infrastructure ready — customers table created and populated on app start. US1 and US3 can now proceed.

---

## Phase 3: User Story 1 — View Customer Directory (Priority: P1)

**Goal**: User navigates to the customer directory and sees a list of all customers. Clicking a customer reveals their full profile.

**Independent Test**: Navigate to /customers → see 10 customers with name and email. Click a customer → see full profile with all fields. Empty directory shows "No customers found" message.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T007 [P] [US1] Write failing integration test for GET /api/customers in tests/integration/customers.test.ts — test cases: list returns all customers with id/fullName/email, list returns empty array when no customers exist
- [x] T008 [P] [US1] Write failing integration test for GET /api/customers/:id in tests/integration/customers.test.ts — test cases: returns full customer detail (all fields), returns 404 for unknown id

### Implementation for User Story 1

- [x] T009 [US1] Implement GET /api/customers route handler in src/app/api/customers/route.ts — query all customers, return summary (id, fullName, email), sorted by fullName
- [x] T010 [US1] Implement GET /api/customers/[id] route handler in src/app/api/customers/[id]/route.ts — full detail with all fields, 404 if not found
- [x] T011 [US1] Verify T007 and T008 integration tests pass
- [x] T012 [P] [US1] Create customer list component in src/components/customer-list.tsx — table with columns: name, email. Click row navigates to /customers/[id]
- [x] T013 [P] [US1] Create customer detail component in src/components/customer-detail.tsx — profile card showing all fields (name, email, phone, full address)
- [x] T014 [US1] Create customer directory page in src/app/customers/page.tsx — fetch from GET /api/customers, render CustomerList, show "No customers found" when empty (FR-008)
- [x] T015 [US1] Create customer detail page in src/app/customers/[id]/page.tsx — fetch from GET /api/customers/:id, render CustomerDetail, handle 404
- [x] T016 [US1] Add "Customers" link to navigation in src/app/layout.tsx

**Checkpoint**: Customer directory fully functional — users can browse and view all customer profiles.

---

## Phase 4: User Story 3 — Autofill Loan Application from Customer (Priority: P3)

**Goal**: When starting a new loan application, the borrower can select an existing customer to auto-populate the applicant name and email fields. Auto-populated values are editable.

**Independent Test**: Navigate to /apply → see customer selector → select a customer → name and email fields auto-fill → edit the fields → submit successfully.

### Tests for User Story 3

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T017 [US3] Write failing integration test for customer selection flow in tests/integration/customers.test.ts — test cases: GET /api/customers returns data usable for selection (id, fullName, email present in each record)

### Implementation for User Story 3

- [x] T018 [US3] Create customer select component in src/components/customer-select.tsx — searchable dropdown that fetches GET /api/customers, displays customer name + email, fires onSelect callback with { fullName, email }
- [x] T019 [US3] Integrate customer select into loan application page in src/app/apply/page.tsx — add CustomerSelect above LoanForm, on selection set applicantName and applicantEmail in the form (fields remain editable per FR-007)
- [x] T020 [US3] Verify T017 test passes

**Checkpoint**: All user stories independently functional.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T021 [P] Add "Customers" card to home page in src/app/page.tsx — navigation card alongside existing Apply, Check Status, Officer Review
- [x] T022 [P] Add loading states to customer directory and detail pages — skeleton loaders while fetching
- [x] T023 [P] Add error states to customer pages — network error handling, database unavailable message
- [x] T024 Apply Impeccable design polish to customer directory and detail pages — consistent spacing, colour hierarchy, typography per Design Quality constitution principle
- [x] T025 Verify WCAG 2.1 AA compliance on new pages — table labels, keyboard navigation, focus management, colour contrast
- [x] T026 Run full test suite (npm test) and verify all tests pass (both feature 001 and 002)
- [x] T027 Run quickstart.md validation — follow quickstart steps from scratch, verify all flows work end to end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **US2 — Seed Data (Phase 2)**: Depends on Setup (T001, T002) — BLOCKS US1 and US3
- **US1 — Customer Directory (Phase 3)**: Depends on US2 completion (customers must exist in DB)
- **US3 — Autofill (Phase 4)**: Depends on US2 completion (customers must exist for selection) and benefits from US1 API routes (reuses GET /api/customers)
- **Polish (Phase 5)**: Depends on all user stories being complete

### User Story Dependencies

- **US2 (Seed Data)**: Foundational — must complete first. Depends only on Setup phase.
- **US1 (Customer Directory)**: Depends on US2 (needs customers in DB). No dependency on US3.
- **US3 (Autofill)**: Depends on US2 (needs customers for selection). Reuses GET /api/customers from US1, so US1 API routes should exist first.

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- API routes before UI components
- Shared components before pages
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- Setup: T001 + T002 can run in parallel (different files)
- US2: T003 + T004 (test writing) can run in parallel
- US1: T007 + T008 (tests) can run in parallel; T012 + T013 (components) can run in parallel
- Polish: T021 + T022 + T023 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch tests for US1 together:
Task: T007 "Integration test for GET /api/customers (list)"
Task: T008 "Integration test for GET /api/customers/:id (detail)"

# After API routes implemented, launch UI components together:
Task: T012 "Customer list component"
Task: T013 "Customer detail component"
```

---

## Implementation Strategy

### MVP First (US2 + US1)

1. Complete Phase 1: Setup (types + seed data module)
2. Complete Phase 2: US2 (migration + seed data + tests)
3. Complete Phase 3: US1 (customer directory + tests)
4. **STOP and VALIDATE**: Browse customer directory, view profiles, verify seed data
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + US2 → Seed data working, customers in DB
2. Add US1 → Customer directory browsable → Demo (MVP!)
3. Add US3 → Autofill on loan form → Demo (full feature)
4. Polish → Final validation → Ship

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (TDD per constitution)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- US2 is P2 in the spec but implemented first because it's foundational infrastructure
