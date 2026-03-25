# Tasks: Loan Processing Application

**Input**: Design documents from `/specs/001-loan-processing-app/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api.md

**Tests**: Included — constitution mandates Test-First Development (NON-NEGOTIABLE).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

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

**Purpose**: Project initialization, dependencies, and tooling

- [ ] T001 Initialize Next.js 15 project with TypeScript strict mode, App Router, Tailwind CSS, and configure tsconfig.json
- [ ] T002 Install and configure dependencies: better-sqlite3, @types/better-sqlite3, nanoid, shadcn/ui CLI
- [ ] T003 [P] Configure Vitest with React Testing Library in vitest.config.ts and tests/setup.ts (in-memory SQLite for integration tests)
- [ ] T004 [P] Initialize shadcn/ui and add base components: Button, Input, Select, Card, Table, Badge, Alert, Form, Label, Textarea
- [ ] T005 [P] Create shared TypeScript types in src/types/index.ts (LoanApplication, QualificationResult, Decision, QualificationInput, ApiError)
- [ ] T006 Create root layout in src/app/layout.tsx with navigation (Borrower: Apply, Check Status | Officer: Review Applications)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can begin

**CRITICAL**: No user story work can begin until this phase is complete

- [ ] T007 Create hardcoded defaults and thresholds module in src/lib/defaults.ts (property tax rate 1.2%, insurance $1200/yr, HOA $0, MI rate 0.5% if LTV>80%, RFC 3%, reserve months 2, DTI max 43%, front-end max 28%, LTV max 97%, min credit score 620)
- [ ] T008 Write failing unit tests for qualification engine in tests/unit/qualification.test.ts — test cases: PI calculation (30yr and 15yr), PHE calculation, GMI derivation, DTI ratio, front-end ratio, LTV for purchase and refinance, reserve months, funds to close check, full qualification pass, full qualification fail with multiple failed tests
- [ ] T009 Implement qualification engine as pure functions in src/lib/qualification.ts — calculatePI, calculatePHE, calculateGMI, calculateQV, calculateRatios, checkAssets, evaluateQualification (must pass T008 tests)
- [ ] T010 Write failing unit tests for validation in tests/unit/validation.test.ts — test cases: valid purchase app, valid refinance app (no purchase price), missing name, invalid email, income zero, credit score out of range, loan amount boundaries, interest rate boundaries, purchase price required for purchase type, purchase price ignored for refinance
- [ ] T011 Implement shared validation functions in src/lib/validation.ts — validateApplicationInput returning field-level errors (must pass T010 tests)
- [ ] T012 Write failing unit tests for defaults calculation in tests/unit/defaults.test.ts — test cases: monthly property tax from value, monthly insurance, MI with LTV>80%, MI with LTV<=80%, AVA calculation, RFC calculation
- [ ] T013 Verify T007 defaults module passes T012 tests (adjust if needed)
- [ ] T014 Create SQLite database module in src/lib/db.ts — singleton connection, migration runner using user_version pragma
- [ ] T015 Create migration v1: loan_applications table in src/lib/db.ts migrations array (schema per data-model.md)
- [ ] T016 Create migration v2: decisions table in src/lib/db.ts migrations array (schema per data-model.md)
- [ ] T017 Write failing integration test for database setup in tests/integration/db.test.ts — verify tables created, user_version set, migrations idempotent

**Checkpoint**: Foundation ready — qualification engine tested, validation tested, database initialized. User story implementation can now begin.

---

## Phase 3: User Story 1 — Submit a Loan Application (Priority: P1) MVP

**Goal**: Borrower fills out mortgage application form, system validates, calculates qualification, persists to SQLite, returns confirmation with reference number.

**Independent Test**: Submit the form with valid data → see confirmation with reference number. Submit with invalid data → see field-level errors. Select refinance → purchase price hidden.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T018 [P] [US1] Write failing integration test for POST /api/applications in tests/integration/applications.test.ts — test cases: create valid purchase application (verify 201, reference number format LN-XXXXXXXX, qualification_data populated, status Pending), create valid refinance application (no purchase price, QV = property value), reject invalid input (400 with field errors), reject missing required fields
- [ ] T019 [P] [US1] Write failing integration test for reference number lookup in tests/integration/applications.test.ts — test cases: GET /api/applications?ref=LN-XXXXXXXX returns matching app, GET with unknown ref returns 404

### Implementation for User Story 1

- [ ] T020 [US1] Implement POST /api/applications route handler in src/app/api/applications/route.ts — validate input, generate reference number (nanoid), compute defaults, run qualification engine, persist to SQLite, return 201 with application + qualification data
- [ ] T021 [US1] Implement GET /api/applications?ref= query handler in src/app/api/applications/route.ts — lookup by reference number, return borrower-safe response (no full qualification breakdown), 404 if not found
- [ ] T022 [US1] Verify T018 and T019 integration tests pass
- [ ] T023 [P] [US1] Create loan application form component in src/components/loan-form.tsx — fields per FR-001 (name, email, income, monthly debts, credit score, transaction type select, loan amount, term, interest rate, property value, conditional purchase price), client-side validation using shared validation.ts, loading state on submit
- [ ] T024 [US1] Create apply page in src/app/apply/page.tsx — render LoanForm, on success show confirmation card with reference number, on error show field-level errors
- [ ] T025 [US1] Implement conditional purchase price field — hidden when transaction type is "refinance", shown and required when "purchase"

**Checkpoint**: User Story 1 fully functional — borrower can submit applications, see confirmation, system calculates qualification.

---

## Phase 4: User Story 2 — Review & Decide on Applications (Priority: P2)

**Goal**: Loan officer views pending applications list, opens detail with qualification summary, approves or rejects with optional note. Officer may override qualification result.

**Independent Test**: Navigate to officer list → see pending apps with qualification badge. Open detail → see full qualification summary (GMI, DTI%, LTV%, etc.). Approve or reject → status updates, decision persists. Try to re-decide → 409 error.

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T026 [P] [US2] Write failing integration test for GET /api/applications (list) in tests/integration/applications.test.ts — test cases: list pending applications (default), list all applications, empty list returns empty array, list includes qualification result summary
- [ ] T027 [P] [US2] Write failing integration test for GET /api/applications/[id] in tests/integration/applications.test.ts — test cases: get full detail with qualification data, 404 for unknown id, includes decision when decided
- [ ] T028 [P] [US2] Write failing integration test for POST /api/applications/[id]/decide in tests/integration/decisions.test.ts — test cases: approve pending app (200, status Approved, decision saved), reject pending app (200, status Rejected), approve non-qualified app (is_override=true), reject qualified app (is_override=true), 409 on already-decided app, 400 on invalid decision type

### Implementation for User Story 2

- [ ] T029 [US2] Implement GET /api/applications list handler in src/app/api/applications/route.ts — query by status param (default Pending), return summary fields + qualified flag
- [ ] T030 [US2] Implement GET /api/applications/[id] route handler in src/app/api/applications/[id]/route.ts — full detail with parsed qualification_data JSON, include decision if exists
- [ ] T031 [US2] Implement POST /api/applications/[id]/decide route handler in src/app/api/applications/[id]/decide/route.ts — validate decision type, check not already decided (409), determine is_override, insert decision, update application status, return updated app
- [ ] T032 [US2] Verify T026, T027, T028 integration tests pass
- [ ] T033 [P] [US2] Create application list component in src/components/application-list.tsx — table with columns: applicant name, loan amount, transaction type, qualification badge (Qualified/Not Qualified), date submitted. Click row navigates to detail.
- [ ] T034 [P] [US2] Create qualification summary component in src/components/qualification-summary.tsx — display card with GMI, PHE, TMD, Front-End %, DTI %, LTV %, Reserve Months, Credit Score, Qualified badge, failed tests list (if any)
- [ ] T035 [P] [US2] Create decision form component in src/components/decision-form.tsx — approve/reject buttons, optional note textarea, disabled state when already decided, shows existing decision when present
- [ ] T036 [US2] Create application detail component in src/components/application-detail.tsx — combines applicant info, loan details, qualification summary, and decision form
- [ ] T037 [US2] Create officer list page in src/app/officer/page.tsx — fetch and render ApplicationList
- [ ] T038 [US2] Create officer detail page in src/app/officer/[id]/page.tsx — fetch and render ApplicationDetail with QualificationSummary and DecisionForm

**Checkpoint**: User Stories 1 AND 2 fully functional — complete loan lifecycle (submit → review → decide).

---

## Phase 5: User Story 3 — View Application Status (Priority: P3)

**Goal**: Borrower looks up application by reference number, sees status and decision note.

**Independent Test**: Enter valid reference number → see application details and current status. Enter invalid reference → see "not found" message. View decided application → see decision note.

### Tests for User Story 3

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T039 [P] [US3] Write failing integration test for borrower status lookup in tests/integration/applications.test.ts — test cases: lookup pending app by ref (shows status, no decision), lookup approved app (shows decision note), lookup rejected app (shows decision note), lookup unknown ref (404 message)

### Implementation for User Story 3

- [ ] T040 [P] [US3] Create status lookup component in src/components/status-lookup.tsx — reference number input field, search button, loading state, displays application status card on success, "not found" alert on 404
- [ ] T041 [US3] Create status page in src/app/status/page.tsx — render StatusLookup, fetch from GET /api/applications?ref=, display results (applicant name, loan amount, status badge, decision note if decided)
- [ ] T042 [US3] Verify T039 integration tests pass

**Checkpoint**: All user stories independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T043 [P] Create home page in src/app/page.tsx — landing page with navigation cards to Apply (borrower), Check Status (borrower), Review Applications (officer)
- [ ] T044 [P] Add error states to all pages — network error handling, database unavailable message per edge case spec
- [ ] T045 [P] Add empty states — officer list with no pending apps, status lookup with no results
- [ ] T046 [P] Add loading states — skeleton loaders for officer list, detail page, status lookup
- [ ] T047 Apply Impeccable design polish across all pages — consistent spacing, colour hierarchy, typography per Design Quality constitution principle
- [ ] T048 Verify WCAG 2.1 AA compliance — form labels, error announcements, keyboard navigation, focus management, colour contrast
- [ ] T049 Run full test suite (npm test) and verify all tests pass
- [ ] T050 Run quickstart.md validation — follow quickstart steps from scratch, verify all flows work end to end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in priority order (P1 → P2 → P3)
  - US2 depends on US1 data (needs applications to exist)
  - US3 depends on US1 data (needs applications to look up) and benefits from US2 (decisions to display)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — No dependencies on other stories
- **User Story 2 (P2)**: Can start after US1 API routes exist (needs POST /api/applications to create test data). UI can be built in parallel.
- **User Story 3 (P3)**: Can start after US1 API routes exist (needs ref lookup endpoint). Benefits from US2 for decision display.

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- API routes before UI components
- Shared components before pages
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T003, T004, T005)
- Foundational: T008+T010+T012 (test writing) can run in parallel
- US1: T018+T019 (tests) can run in parallel; T023 (form) after API routes
- US2: T026+T027+T028 (tests) can run in parallel; T033+T034+T035 (components) can run in parallel
- US3: T040 (component) can start while T039 (test) runs

---

## Parallel Example: User Story 2

```bash
# Launch all tests for US2 together:
Task: T026 "Integration test for GET /api/applications (list)"
Task: T027 "Integration test for GET /api/applications/[id]"
Task: T028 "Integration test for POST /api/applications/[id]/decide"

# After API routes implemented, launch UI components together:
Task: T033 "Application list component"
Task: T034 "Qualification summary component"
Task: T035 "Decision form component"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Submit a loan application, verify confirmation, check qualification in SQLite
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Demo (MVP!)
3. Add User Story 2 → Test independently → Demo (full lifecycle)
4. Add User Story 3 → Test independently → Demo (borrower self-service)
5. Polish → Final validation → Ship

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing (TDD per constitution)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
