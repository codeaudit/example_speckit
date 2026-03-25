# Tasks: Enhanced Officer Workflow

**Input**: Design documents from `/specs/004-enhanced-officer-workflow/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api.md, quickstart.md

**Tests**: Included — Constitution Principle I (Test-First Development) is NON-NEGOTIABLE. Integration tests for new API endpoint and unit tests for theme toggle logic are written before implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story. US1 (Officer Customer-Centric Review) and US2 (Customer Loan Display) share the API endpoint and customer-applications component, so these are placed in the Foundational phase. US3 (Theme Toggle) is independent.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single Next.js project**: `src/` at repository root
- Tests in `tests/` at repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: New types, CSS dark mode switch from media-query to class-based

- [x] T001 Add `CustomerWithAppCount` and `CustomerApplication` types to src/types/index.ts — `CustomerWithAppCount` extends `CustomerSummary` with `applicationCount: number`; `CustomerApplication` has id, referenceNumber, loanAmount, transactionType, status, qualificationStatus, createdAt
- [x] T002 Switch dark mode from media-query to class-based in src/app/globals.css — add `@custom-variant dark (&:where(.dark, .dark *));` so the `dark:` variant is controlled by a `.dark` class on `<html>` instead of `prefers-color-scheme` media query

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: API endpoints shared by US1 and US2 — MUST complete before user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Tests (write FIRST, ensure they FAIL before implementation)

- [x] T003 [P] Write integration tests for GET /api/customers/:id/applications endpoint in tests/integration/customer-applications.test.ts — test cases: (1) returns matching applications for a customer by email JOIN, (2) returns empty array for customer with no applications, (3) returns 404 for non-existent customer, (4) derives qualificationStatus correctly (Qualified/Not Qualified/N/A from qualification_data JSON), (5) orders results by createdAt DESC
- [x] T004 [P] Write integration tests for GET /api/customers?include=applicationCount in tests/integration/customer-applications.test.ts — test cases: (1) returns applicationCount field when include=applicationCount param is present, (2) counts match actual applications per customer email, (3) existing response unchanged without include param

### Implementation

- [x] T005 Create GET /api/customers/:id/applications route handler in src/app/api/customers/[id]/applications/route.ts — query loan_applications joined with customers on email, derive qualificationStatus from qualification_data JSON (Qualified if failedTests empty, Not Qualified if failedTests non-empty, N/A if no qualification_data), return 404 if customer not found, return empty array if no matching applications
- [x] T006 Enhance GET /api/customers route handler in src/app/api/customers/route.ts — add optional `include=applicationCount` query parameter support; when present, add SQL subquery `(SELECT COUNT(*) FROM loan_applications WHERE applicant_email = c.email) AS application_count` to existing query; return `applicationCount` field in each customer object
- [x] T007 Verify integration tests pass after implementation — run `npm test -- tests/integration/customer-applications.test.ts`

**Checkpoint**: API endpoints working — both new endpoint and enhanced customers endpoint return correct data. All integration tests pass.

---

## Phase 3: User Story 1 — Officer Customer-Centric Review (Priority: P1) 🎯 MVP

**Goal**: Officers see a customer list on /officer, drill into a customer to see profile + loans, and review pending applications from the customer context.

**Independent Test**: Navigate to /officer → see customer list → click customer → see profile + applications → click "Review" on pending app → approve/reject → see updated status.

### Implementation for User Story 1

- [x] T008 [P] [US1] Create OfficerCustomerList component in src/components/officer-customer-list.tsx — client component that fetches from /api/customers?include=applicationCount, displays table with columns: Customer Name (link to /officer/customer/[id]), Email, Applications (count). Include loading skeleton, error state, and empty state. Dark mode support with existing Tailwind patterns (dark:bg-gray-800, dark:border-gray-700, etc.). Focus-visible on name links.
- [x] T009 [P] [US1] Create CustomerApplications component in src/components/customer-applications.tsx — client component that accepts customerId prop, fetches from /api/customers/:id/applications, displays table with columns: Reference Number, Loan Amount (right-aligned, formatted currency), Transaction Type, Qualification Status (semantic badge), Application Status (semantic badge), Actions (Review link for Pending only, links to /officer/[appId]). Include loading skeleton, error state, empty state ("No loan applications for this customer"). Dark mode support. Badge colors: Qualified=green, Not Qualified=red, N/A=gray, Pending=amber, Approved=green, Rejected=red.
- [x] T010 [US1] Modify officer dashboard page in src/app/officer/page.tsx — replace ApplicationList component usage with OfficerCustomerList component. Update page heading to "Officer Review — Customers". Keep existing dark mode styles.
- [x] T011 [US1] Create officer customer detail page at src/app/officer/customer/[id]/page.tsx — server or client page that fetches customer profile from /api/customers/:id and displays CustomerDetail component (existing) plus CustomerApplications component (new, with review links). Include back link to /officer. Page heading: customer's full name. Dark mode support. Loading and error states.

**Checkpoint**: Officer can navigate /officer → customer list → customer detail with applications → review pending application via existing /officer/[appId] page. All 5 acceptance scenarios from spec US1 are testable.

---

## Phase 4: User Story 2 — Customer Loan Information Display (Priority: P2)

**Goal**: Customer directory detail pages show a "Loan Applications" section with all applications matched by email.

**Independent Test**: Navigate to /customers → click customer → see profile + loan applications section with correct data. Customer with no apps shows "No loan applications found."

### Implementation for User Story 2

- [x] T012 [US2] Modify customer detail page in src/app/customers/[id]/page.tsx — add a "Loan Applications" section below the existing CustomerDetail component. Reuse the CustomerApplications component from T009 but without review links (pass a prop like `showReviewLink={false}` or create the component to conditionally show review links based on a prop). The component should display "No loan applications found." for customers with no matching applications. Dark mode support.

**Checkpoint**: Customer directory shows loan applications for each customer. No review links appear (officer-only). All 4 acceptance scenarios from spec US2 are testable.

---

## Phase 5: User Story 3 — Dark/Light Mode Toggle (Priority: P3)

**Goal**: Manual theme toggle in nav bar with session-only persistence, overriding system preference.

**Independent Test**: Load app → see toggle in nav → click toggle → theme switches immediately → navigate → theme persists → reload → resets to system preference.

### Tests (write FIRST, ensure they FAIL before implementation)

- [x] T013 [US3] Write unit tests for theme context logic in tests/unit/theme-toggle.test.ts — test cases: (1) initial theme follows system preference (mock matchMedia), (2) toggleTheme switches from light to dark, (3) toggleTheme switches from dark to light, (4) manual override persists across context reads, (5) system preference change updates theme when no manual override, (6) system preference change is ignored when manual override is active

### Implementation for User Story 3

- [x] T014 [US3] Create ThemeProvider context in src/lib/theme-context.tsx — React context with ThemeProvider component that: (a) on mount reads window.matchMedia('(prefers-color-scheme: dark)') and applies/removes 'dark' class on document.documentElement, (b) sets color-scheme style property ('light' or 'dark') on document.documentElement, (c) listens for matchMedia changes when no manual override, (d) exposes { theme, toggleTheme } via useTheme() hook, (e) stores isManualOverride in state (session-only, no localStorage)
- [x] T015 [US3] Create ThemeToggle button component in src/components/theme-toggle.tsx — client component using useTheme() hook, renders button with inline SVG sun icon (visible in dark mode) and moon icon (visible in light mode), aria-label "Switch to dark mode" / "Switch to light mode", styled with dark mode support, hover and focus-visible states
- [x] T016 [US3] Integrate ThemeProvider and ThemeToggle into layout in src/app/layout.tsx — wrap body content in ThemeProvider (requires a client wrapper component since layout.tsx is a server component), add ThemeToggle button to nav bar (after navigation links), remove `scheme-light-dark` class from `<html>` element (class-based mode replaces it)
- [x] T017 [US3] Verify unit tests pass after implementation — run `npm test -- tests/unit/theme-toggle.test.ts`

**Checkpoint**: Theme toggle button visible in nav. Click switches theme immediately. Persists across navigation. Resets on reload. All 5 acceptance scenarios from spec US3 are testable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across all stories

- [x] T018 Run full test suite (`npm test`) and verify all existing 85 tests plus new tests pass with no regressions
- [x] T019 Run production build (`npm run build`) and verify no build errors
- [x] T020 Run quickstart.md verification — follow all 7 scenarios in specs/004-enhanced-officer-workflow/quickstart.md across light and dark modes
- [x] T021 Verify edge cases from spec — rapid theme toggle (no glitches), empty customer views, multiple applications display, already-decided application (no Review link)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup (T001 for types, T002 for CSS) — BLOCKS US1 and US2
- **US1 (Phase 3)**: Depends on Foundational (T005, T006 for API endpoints)
- **US2 (Phase 4)**: Depends on Foundational (T005 for API) AND US1 (T009 for CustomerApplications component)
- **US3 (Phase 5)**: Depends on Setup (T002 for class-based dark mode) — independent of US1/US2
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational — creates shared CustomerApplications component
- **US2 (P2)**: Can start after US1 (reuses CustomerApplications from T009) — or can run in parallel if component is extracted to foundational
- **US3 (P3)**: Independent of US1 and US2 — can run in parallel after Setup

### Within Each User Story

- US1: T008 and T009 can run in parallel (different files), then T010 and T011 sequentially (depend on components)
- US2: Single task (T012) — depends on T009 component
- US3: T013 (tests) first, then T014 and T015 in parallel (different files), then T016 (integration), then T017 (verify)

### Parallel Opportunities

- Phase 1: T001 and T002 can run in parallel (different files)
- Phase 2: T003 and T004 tests in parallel, then T005 and T006 implementation in parallel
- Phase 3: T008 and T009 in parallel
- Phase 5: T014 and T015 in parallel (after T013 tests)
- US1 and US3 can run in parallel after their respective prerequisites

---

## Parallel Example: User Story 1

```bash
# After Foundational (T005-T007), launch US1 component tasks in parallel:
Task: T008 "Officer customer list component"
Task: T009 "Customer applications component"

# Then sequential page tasks:
Task: T010 "Modify officer page"
Task: T011 "Create officer customer detail page"
```

## Parallel Example: US1 + US3

```bash
# After Setup + Foundational, US1 and US3 can run in parallel:
# Stream A (US1):
Task: T008, T009 (parallel) → T010 → T011

# Stream B (US3):
Task: T013 (tests) → T014, T015 (parallel) → T016 → T017
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1: Setup (types + CSS)
2. Complete Phase 2: Foundational (API endpoints + tests)
3. Complete Phase 3: US1 (officer customer-centric review)
4. **STOP and VALIDATE**: Test officer workflow end-to-end
5. Demo if ready

### Incremental Delivery

1. Setup + Foundational → API endpoints working → Tests passing
2. Add US1 → Officer customer review working → Demo (MVP!)
3. Add US2 → Customer directory shows loans → Demo
4. Add US3 → Theme toggle working → Demo (full feature)
5. Polish → Final validation, all tests pass → Ship

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Test-first: T003/T004 (API tests) and T013 (theme tests) must be written and FAIL before implementation
- Commit after each phase or logical group
- Stop at any checkpoint to validate story independently
- The CustomerApplications component (T009) is shared between US1 and US2 — it accepts a prop to show/hide review links
- No schema changes — all data relationships via email JOIN at query time
- No new dependencies — all implementation uses existing stack
