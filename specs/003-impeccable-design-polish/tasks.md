# Tasks: Impeccable Design Polish

**Input**: Design documents from `/specs/003-impeccable-design-polish/`
**Prerequisites**: plan.md, spec.md, research.md, quickstart.md

**Tests**: Not included — this is a visual-only polish feature. All 85 existing tests must continue to pass (verified in Polish phase). Visual verification done manually per quickstart.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story. US1 (Dark Mode) is foundational — US2 and US3 build on the dark-mode-aware base classes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single Next.js project**: `src/` at repository root
- No new test files; existing tests in `tests/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Theme foundation — CSS variables, HTML root element, layout dark mode

- [x] T001 Add `scheme-light-dark` class to `<html>` element in src/app/layout.tsx so native form controls respect dark mode via CSS `color-scheme: light dark`
- [x] T002 Add dark mode base styles to `<body>` in src/app/layout.tsx — add `dark:bg-gray-900 dark:text-gray-100` alongside existing `bg-gray-50 text-gray-900`
- [x] T003 Add dark mode styles to navigation bar in src/app/layout.tsx — add `dark:bg-gray-800 dark:border-gray-700` to `<nav>`, `dark:text-gray-100` to logo link, `dark:text-gray-400 dark:hover:text-gray-100` to nav links

---

## Phase 2: User Story 1 — Dark Mode Support (Priority: P1)

**Goal**: All pages and components render correctly in both light and dark modes with no broken layouts, invisible text, or unreadable elements.

**Independent Test**: Toggle OS between light and dark mode → verify all pages render correctly in both themes with no unreadable text, invisible borders, or broken contrast.

### Implementation for User Story 1

- [x] T004 [P] [US1] Add dark mode classes to home page cards in src/app/page.tsx — card containers: `dark:bg-gray-800 dark:border-gray-700`, card text: `dark:text-gray-100` for titles, `dark:text-gray-400` for descriptions, card links: `dark:text-blue-400 dark:hover:text-blue-300`
- [x] T005 [P] [US1] Add dark mode classes to application list component in src/components/application-list.tsx — table container: `dark:bg-gray-800 dark:border-gray-700`, table header: `dark:bg-gray-750` (use `dark:bg-gray-800/50`), header text: `dark:text-gray-400`, rows: `dark:hover:bg-gray-700/50`, row dividers: `dark:divide-gray-700`, cell text: `dark:text-gray-200`, date text: `dark:text-gray-400`, review link: `dark:text-blue-400 dark:hover:text-blue-300`, loading/empty states: `dark:text-gray-400`, error state: `dark:bg-red-900/20 dark:text-red-400`
- [x] T006 [P] [US1] Add dark mode classes to application detail component in src/components/application-detail.tsx — card backgrounds, text colors, borders, and definition list styling for dark mode
- [x] T007 [P] [US1] Add dark mode classes to qualification summary component in src/components/qualification-summary.tsx — metric cards, text, borders for dark mode
- [x] T008 [P] [US1] Add dark mode classes to decision form component in src/components/decision-form.tsx — form backgrounds, input fields (`dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100`), labels, buttons, select elements for dark mode
- [x] T009 [P] [US1] Add dark mode classes to loan form component in src/components/loan-form.tsx — form container, all input fields, labels, select elements, submit button, error messages for dark mode
- [x] T010 [P] [US1] Add dark mode classes to status lookup component in src/components/status-lookup.tsx — form container, input field, button, result display for dark mode
- [x] T011 [P] [US1] Add dark mode classes to customer list component in src/components/customer-list.tsx — table container, headers, rows, hover states, links, empty state for dark mode
- [x] T012 [P] [US1] Add dark mode classes to customer detail component in src/components/customer-detail.tsx — profile card, definition list, labels, values for dark mode
- [x] T013 [P] [US1] Add dark mode classes to customer select component in src/components/customer-select.tsx — dropdown container, search input, option list, hover/selected states for dark mode
- [x] T014 [P] [US1] Add dark mode classes to apply page in src/app/apply/page.tsx — page heading, any wrapper elements for dark mode
- [x] T015 [P] [US1] Add dark mode classes to status page in src/app/status/page.tsx — page heading, layout for dark mode
- [x] T016 [P] [US1] Add dark mode classes to officer dashboard page in src/app/officer/page.tsx — page heading, layout for dark mode
- [x] T017 [P] [US1] Add dark mode classes to officer detail page in src/app/officer/[id]/page.tsx — page heading, layout, action sections for dark mode
- [x] T018 [P] [US1] Add dark mode classes to customer directory page in src/app/customers/page.tsx — page heading, layout for dark mode
- [x] T019 [P] [US1] Add dark mode classes to customer detail page in src/app/customers/[id]/page.tsx — page heading, back link, layout for dark mode

**Checkpoint**: All pages render correctly in both light and dark mode. Toggle OS theme and verify every page visually.

---

## Phase 3: User Story 2 — Visual Hierarchy & Typography Polish (Priority: P2)

**Goal**: Consistent typographic scale across all pages. Applicant name, loan amount, and qualification status are the most visually prominent elements. Currency values right-aligned and consistently formatted.

**Independent Test**: Navigate through all pages → verify consistent heading sizes, spacing, font weights. On officer detail page, applicant name and loan amount should stand out immediately.

### Implementation for User Story 2

- [x] T020 [US2] Standardize page headings across all pages to use `text-2xl font-bold` — update src/app/page.tsx, src/app/apply/page.tsx, src/app/status/page.tsx, src/app/officer/page.tsx, src/app/customers/page.tsx to use consistent heading size and weight
- [x] T021 [P] [US2] Polish visual hierarchy on officer detail page in src/app/officer/[id]/page.tsx — make applicant name and loan amount the most visually prominent elements using `text-xl font-bold` for name and `text-2xl font-bold` for loan amount
- [x] T022 [P] [US2] Polish application detail component in src/components/application-detail.tsx — use consistent typographic scale: section headings `text-lg font-semibold`, body text `text-sm`, metadata/dates `text-xs text-gray-500 dark:text-gray-400`
- [x] T023 [P] [US2] Ensure currency values are right-aligned in table columns in src/components/application-list.tsx — add `text-right` to loan amount column header and cells, verify `formatCurrency` output is consistent
- [x] T024 [P] [US2] Polish qualification summary typography in src/components/qualification-summary.tsx — metric labels `text-xs font-medium uppercase`, metric values `text-lg font-semibold`, ensure percentages use consistent decimal places
- [x] T025 [P] [US2] Standardize spacing between sections across all pages — ensure consistent `space-y-6` or `space-y-8` between major sections, `space-y-4` between subsections, `gap-4` within component groups

**Checkpoint**: All pages use consistent typographic scale. Officer detail page shows applicant name and loan amount prominently.

---

## Phase 4: User Story 3 — Component Polish & State Refinement (Priority: P3)

**Goal**: All interactive elements have visible hover/focus states. Status badges use consistent semantic colors. Loading states use skeleton loaders. Form fields show visible focus indicators.

**Independent Test**: Tab through every page with keyboard → verify focus rings on all interactive elements. Check all badges use correct semantic colors. Verify skeleton loaders appear during data fetch.

### Implementation for User Story 3

- [x] T026 [P] [US3] Standardize status badge colors in src/components/application-list.tsx — Qualified: `bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`, Not Qualified: `bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`, add Pending badge: `bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200`
- [x] T027 [P] [US3] Standardize status badge colors in src/components/qualification-summary.tsx — use same semantic color scheme as T026 for qualification status display
- [x] T028 [P] [US3] Add focus-visible styles to all form inputs in src/components/loan-form.tsx — add `focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none` to all `<input>` and `<select>` elements
- [x] T029 [P] [US3] Add focus-visible styles to all form inputs in src/components/decision-form.tsx — add `focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none` to all `<input>`, `<select>`, and `<textarea>` elements
- [x] T030 [P] [US3] Add focus-visible styles to status lookup form in src/components/status-lookup.tsx — add `focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none` to input and button
- [x] T031 [P] [US3] Add focus-visible styles to customer select dropdown in src/components/customer-select.tsx — add focus ring to search input and keyboard-navigable dropdown items
- [x] T032 [P] [US3] Add consistent hover/focus styles to all buttons across components — primary buttons: `hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600`, secondary buttons with appropriate hover states
- [x] T033 [P] [US3] Replace loading text with skeleton loaders in src/components/application-list.tsx — replace `<p>Loading...</p>` with animated skeleton rows: 5 rows of `animate-pulse` divs matching table column widths with `bg-gray-200 dark:bg-gray-700 rounded`
- [x] T034 [P] [US3] Replace loading text with skeleton loaders in src/components/customer-list.tsx — replace loading text with animated skeleton table rows matching the customer list layout
- [x] T035 [P] [US3] Replace loading text with skeleton loader in src/components/status-lookup.tsx — replace any loading text with a skeleton/spinner treatment
- [x] T036 [P] [US3] Replace loading text with skeleton loader in src/components/customer-select.tsx — replace loading text in dropdown with skeleton items
- [x] T037 [P] [US3] Add visible focus styles to navigation links in src/app/layout.tsx — add `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 rounded` to all nav links

**Checkpoint**: All interactive elements have visible hover/focus states. All badges use semantic colors. All loading states use skeleton loaders.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across all stories

- [x] T038 Run full test suite (`npm test`) and verify all 85 existing tests pass with no regressions
- [x] T039 Run production build (`npm run build`) and verify no build errors
- [x] T040 Run quickstart.md visual verification — follow all 6 verification scenarios in specs/003-impeccable-design-polish/quickstart.md across light and dark modes
- [x] T041 Verify WCAG 2.1 AA contrast compliance — spot-check text contrast ratios in both light and dark modes on all pages, ensure 4.5:1 minimum for normal text
- [x] T042 Verify edge cases from spec — test "no preference" defaults to light mode, verify badges don't overflow with long text like "Not Qualified", verify high-contrast mode doesn't break layout

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **US1 — Dark Mode (Phase 2)**: Depends on Setup (T001–T003) — establishes dark-mode-aware base that US2 and US3 build on
- **US2 — Typography (Phase 3)**: Can start after Setup, but best after US1 so dark mode text colors are in place
- **US3 — Component Polish (Phase 4)**: Can start after Setup, but best after US1 so dark mode states are in place
- **Polish (Phase 5)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (Dark Mode)**: Foundational — touches every file. Best to complete first so US2/US3 work with dark-mode-aware markup.
- **US2 (Typography)**: Independent of US3. Can run in parallel with US3 if US1 is done.
- **US3 (Component Polish)**: Independent of US2. Can run in parallel with US2 if US1 is done.

### Within Each User Story

- US1: Setup first (T001–T003), then all component/page tasks in parallel
- US2: Page headings (T020) first, then all component tasks in parallel
- US3: All tasks are independent and can run in parallel

### Parallel Opportunities

- US1: T004–T019 can all run in parallel (different files)
- US2: T021–T025 can run in parallel after T020
- US3: T026–T037 can all run in parallel (different files or independent changes)
- Polish: T038–T042 must run sequentially (each validates the previous)

---

## Parallel Example: User Story 1

```bash
# After Setup (T001-T003), launch all US1 tasks in parallel:
Task: T004 "Home page dark mode"
Task: T005 "Application list dark mode"
Task: T006 "Application detail dark mode"
Task: T007 "Qualification summary dark mode"
Task: T008 "Decision form dark mode"
Task: T009 "Loan form dark mode"
Task: T010 "Status lookup dark mode"
Task: T011 "Customer list dark mode"
Task: T012 "Customer detail dark mode"
Task: T013 "Customer select dark mode"
Task: T014-T019 "Page-level dark mode" (all parallel)
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1: Setup (theme foundation)
2. Complete Phase 2: US1 (dark mode on all pages)
3. **STOP and VALIDATE**: Toggle light/dark mode on every page
4. Demo if ready

### Incremental Delivery

1. Setup + US1 → Dark mode working across all pages → Demo (MVP!)
2. Add US2 → Typography consistent, visual hierarchy clear → Demo
3. Add US3 → All interactive states polished, skeleton loaders → Demo (full feature)
4. Polish → Final validation, WCAG compliance → Ship

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- No new test files — all 85 existing tests must pass after each phase
- Commit after each phase or logical group
- Stop at any checkpoint to validate story independently
- US1 (Dark Mode) is P1 in the spec and foundational — complete first
