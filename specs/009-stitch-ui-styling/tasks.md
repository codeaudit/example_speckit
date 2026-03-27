# Tasks: Stitch UI Styling

**Input**: Design documents from `/specs/009-stitch-ui-styling/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓

**Organization**: Tasks are grouped by user story. US1 (design tokens) is the foundation — all other stories depend on it completing first.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks in same phase)
- **[Story]**: Which user story this task belongs to (US1–US5)
- No new tests generated — spec does not request TDD; existing 155 tests serve as regression gate

---

## Phase 1: Setup

**Purpose**: Establish a verified baseline before any changes begin.

- [x] T001 Verify all existing tests pass as the baseline: run `npm test` and record the count (must be 155+ passing, 0 failing)
- [x] T002 Grep for all legacy token usages to know the scope: search for `border-gray-200`, `border-gray-700`, `brand-primary`, `text-primary`, `bg-page`, `bg-gray-800` across `src/` to produce a hit list

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Global CSS tokens and font loading — MUST be complete before any screen-specific work.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete. Every screen depends on these tokens being defined.

- [x] T003 Add Google Fonts preconnect + Manrope + Inter + Material Symbols Outlined link tags to `src/app/layout.tsx` head (replace current import-based body classes; keep `suppressHydrationWarning`)
- [x] T004 Replace the entire content of `src/app/globals.css` with: `@import "tailwindcss"`, `@variant dark`, the complete `@theme {}` block containing all 40+ MD3 color tokens from research.md Decision 2, font-family tokens (`--font-headline: 'Manrope'`, `--font-body: 'Inter'`), and border-radius overrides (`--radius: 0.25rem`, `--radius-lg: 0.5rem`, `--radius-xl: 0.75rem`)
- [x] T005 Append plain CSS utility classes to `src/app/globals.css` after the `@theme` block: `.material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }`, `.signature-gradient { background: linear-gradient(135deg, #003464 0%, #1a4b82 100%); }`, `.glass-effect { backdrop-filter: blur(20px); background-color: rgba(248, 249, 250, 0.8); }`, `body { font-family: 'Inter', sans-serif; background-color: #f8f9fa; color: #191c1d; }`

**Checkpoint**: Tailwind utilities like `bg-primary`, `text-on-surface`, `bg-surface-container-low`, `font-headline` must now resolve. Icons in `material-symbols-outlined` spans must render. Signature gradient must apply.

---

## Phase 3: User Story 1 — Design Token Foundation (Priority: P1) 🎯 MVP

**Goal**: Replace legacy gray-based token classes on shared/base elements throughout the app so the Architectural Curator palette is consistently applied everywhere.

**Independent Test**: Load any page. Page body background is `#f8f9fa` (surface), no gray-800 backgrounds appear, no `border-gray-200` borders are visible on section containers.

- [x] T006 [US1] Update `src/app/layout.tsx` body tag: remove `bg-gray-50 text-gray-900 antialiased dark:bg-gray-900 dark:text-gray-100` → `bg-surface text-on-surface antialiased`; remove `AppShell` import (will be re-added after T007 redesign)
- [x] T007 [US1] Rewrite `src/components/app-shell.tsx` — add conditional layout using `usePathname()`: officer routes (`/officer`, `/customers`) render a 280px fixed left sidebar with `bg-primary` background + nav items (each with Material Symbols icon and label) + main content area `ml-[280px] p-8 bg-surface min-h-screen`; all other routes (borrower/apply) render a minimal white top-bar header with "LoanPro" wordmark + main content area. Sidebar nav: logo (`account_balance` icon + "LoanPro"), nav links: Dashboard/`/officer`/`dashboard`, Applications/`/officer`/`description`, Customers/`/customers`/`group`, Settings/`#`/`settings`; bottom: Help/`contact_support`, Logout/`logout`. Nav link active state: `bg-primary-container text-on-primary` pill.
- [x] T008 [P] [US1] Update `src/components/loan-form.tsx` — replace all `border border-gray-200 bg-white` / `border border-gray-300` input field containers and the form wrapper `rounded-lg border border-gray-200 bg-white shadow-sm` → `bg-surface-container-lowest rounded-lg`; update input classes to `bg-surface-container-lowest rounded-lg border-0 outline-none focus:ring-2 focus:ring-primary/40 px-3 py-2 text-on-surface`; update submit button to `signature-gradient rounded-xl text-on-primary font-semibold px-6 py-3`
- [x] T009 [P] [US1] Update `src/components/customer-select.tsx` — replace border-based card container with `bg-surface-container-low rounded-xl p-4`; replace border input with `bg-surface-container-lowest rounded-lg border-0 focus:ring-2 focus:ring-primary/40`
- [x] T010 [P] [US1] Update `src/components/qualification-summary.tsx` — replace `border border-gray-200 bg-white` section → `bg-surface-container-lowest rounded-xl p-5`; remove any `divide-y divide-gray-200` → `space-y-3`
- [x] T011 [P] [US1] Update `src/components/status-lookup.tsx` — replace border containers with surface-layer equivalents; update input styling to match T008 pattern; update button to `signature-gradient rounded-xl text-on-primary`
- [x] T012 [P] [US1] Update `src/app/page.tsx` (home) — replace any `border border-gray-200 bg-white` containers → `bg-surface-container-lowest rounded-xl`; update heading to `font-headline` class; update CTA button to `signature-gradient rounded-xl text-on-primary`
- [x] T013 [P] [US1] Update `src/app/status/page.tsx` — replace border containers with surface tokens; remove `border-green-200 bg-green-50` success state → `bg-surface-container-lowest rounded-xl` with `text-tertiary-fixed` checkmark icon

**Checkpoint**: All base components use surface tokens. No gray-200 borders on layout containers. Body is `bg-surface`. Fonts render as Inter/Manrope.

---

## Phase 4: User Story 2 — Officer Dashboard & Sidebar (Priority: P2)

**Goal**: Officer landing page (`/officer`) matches the Stitch intelligence dashboard layout with sidebar, KPI grid, and activity feed without dividers.

**Independent Test**: Navigate to `/officer`. Left sidebar shows `account_balance` logo + all 4 nav links with Material Symbols icons. Main area shows a 12-column grid. No `<hr>` or `border-b` between activity items.

- [x] T014 [US2] Rewrite `src/app/officer/page.tsx` — change from plain `<OfficerCustomerList />` embed to a dashboard layout: heading in `font-headline text-2xl font-bold text-on-surface mb-8`; add a `grid grid-cols-12 gap-6` wrapper; place `<ApplicationList />` in `col-span-8` and a placeholder Portfolio Risk summary card in `col-span-4 bg-surface-container-low rounded-xl p-6`; add a "Recent Activity" section below using `space-y-4` (no dividers)
- [x] T015 [P] [US2] Update `src/components/application-list.tsx` — replace outer `border border-gray-200 bg-white` wrapper → `bg-surface-container-lowest rounded-xl overflow-hidden`; replace `divide-y divide-gray-200` table rows → remove divide classes, add `hover:bg-surface-container-low` on each row; update table header `bg-gray-50` → `bg-surface-container-high`; update header text `text-gray-500` → `text-on-surface-variant`; update link color `text-blue-600` → `text-primary`
- [x] T016 [P] [US2] Update `src/components/officer-customer-list.tsx` — same pattern as T015: remove border wrapper → `bg-surface-container-lowest rounded-xl`; remove `divide-y` → hover surface tokens; update header bg → `bg-surface-container-high`

**Checkpoint**: `/officer` page shows sidebar layout (from T007) + borderless application table in 8-col area. No visible 1px dividers. Heading in Manrope.

---

## Phase 5: User Story 3 — Customer Directory (Priority: P3)

**Goal**: Customer directory (`/customers`) shows borderless list with semantic status badge pills.

**Independent Test**: Navigate to `/customers`. No table border wraps the list. Status badges are background-color-only pills. Row hover uses surface tones, not gray.

- [x] T017 [US3] Update `src/components/customer-list.tsx` — remove outer `border border-gray-200` → `bg-surface-container-lowest rounded-xl overflow-hidden`; remove `divide-y divide-gray-200` → no divide classes; update `tbody` rows with `hover:bg-surface-container-low transition-colors`; update header `bg-gray-50` → `bg-surface-container-high`; add a `Status` column with badge: derive status from customer data (e.g., if no data, show "New" for all) rendered as `<span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800">New</span>` — use VIP/needs-attention/new mapping per research Decision 10
- [x] T018 [P] [US3] Update `src/app/customers/page.tsx` — update page heading `text-2xl font-bold` → add `font-headline`; remove any outer border wrapper; verify `bg-surface` body background shows through correctly
- [x] T019 [P] [US3] Update `src/components/customer-detail.tsx` — replace `border border-gray-200 bg-white` section cards → `bg-surface-container-lowest rounded-xl p-5`; replace `divide-y` data lists → `space-y-3`; update `src/components/customer-applications.tsx` similarly

**Checkpoint**: `/customers` page shows borderless customer list with status badge pills. Row hovers use surface-container-low.

---

## Phase 6: User Story 4 — Application Detail (Priority: P4)

**Goal**: Application detail view matches the Stitch mockup: surface-layer sectioning, warm orange rate lock alert, border-l-2 active section indicator, spacer-only document list.

**Independent Test**: Navigate to `/officer/[id]`. All section cards use `bg-surface-container-lowest rounded-xl` on `bg-surface-container-low` background. No `border border-gray-200` section wrappers. Any "rate lock" or urgent alert card uses `bg-tertiary-fixed`.

- [x] T020 [US4] Update `src/components/application-detail.tsx` — replace ALL `section` elements with `rounded-lg border border-gray-200 bg-white` → `bg-surface-container-lowest rounded-xl p-5`; replace `dark:border-gray-700 dark:bg-gray-800` with surface tokens; add an Interest Rate Lock alert card section: `<div className="bg-tertiary-fixed rounded-xl p-4 flex items-center gap-3"><span className="material-symbols-outlined text-tertiary">lock</span><div>...</div></div>`; remove any `divide-y` → `space-y-3`; update all `text-gray-500` → `text-on-surface-variant`; update all `text-gray-900` → `text-on-surface`
- [x] T021 [P] [US4] Update `src/components/decision-form.tsx` — update Approve button to `signature-gradient rounded-xl text-on-primary font-semibold px-6 py-3`; update Reject button to `border border-outline-variant rounded-xl text-on-secondary-fixed-variant font-semibold px-6 py-3 bg-transparent`; remove any border wrappers → `bg-surface-container-lowest rounded-xl p-5`
- [x] T022 [P] [US4] Update `src/app/officer/[id]/page.tsx` — remove any outer border wrapper; update page heading to `font-headline`; ensure `bg-surface` page background

**Checkpoint**: Application detail shows borderless surface-layer sections. Rate lock alert is warm orange (`#ffdcc1`). Decision buttons match the 3-tier hierarchy.

---

## Phase 7: User Story 5 — Borrower Apply Form (Priority: P5)

**Goal**: The apply page uses a 2-column layout (8/4 grid) with a Secure Verification trust sidebar and warm-orange stepper active state.

**Independent Test**: Navigate to `/apply` on a large screen. Page shows 12-column grid: form on left (8 cols), Secure Verification sidebar on right (4 cols) with signature gradient. No border wraps the form card.

- [x] T023 [US5] Update `src/app/apply/page.tsx` — replace `mx-auto max-w-2xl space-y-4` layout with `grid grid-cols-1 lg:grid-cols-12 gap-8 items-start`; form content in `lg:col-span-8 space-y-4`; add a `SecureVerificationSidebar` component inline: `<div className="signature-gradient rounded-xl p-6 text-on-primary sticky top-8">` with lock icon (`material-symbols-outlined text-tertiary-fixed`), heading "Your Data is Secured" in `font-headline font-bold`, and 3 bullet items with `check_circle` icons in `text-tertiary-fixed`; sidebar in `lg:col-span-4`; update success state: replace `border-green-200 bg-green-50` → `bg-surface-container-lowest rounded-xl p-8 text-center`; update "Submit Another" button to `signature-gradient rounded-xl text-on-primary px-6 py-3`; update "Check Status" link to `text-primary font-medium`
- [x] T024 [P] [US5] Update the form card wrapper in `src/app/apply/page.tsx` — the `div` that wraps `<LoanForm>` currently has `rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700` → replace with `bg-surface-container-lowest rounded-xl overflow-hidden` (no shadow, no border)

**Checkpoint**: `/apply` shows 2-column layout with signature gradient trust sidebar. Form card is borderless. Success screen uses surface tokens.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Regression validation, cleanup of any remaining legacy tokens, and final verification.

- [x] T025 Run `npm test` and confirm all existing tests still pass (must be 155+ passing, 0 failing)
- [x] T026 [P] Grep `src/` for remaining legacy token strings (`border-gray-200`, `border-gray-700`, `bg-gray-800`, `bg-gray-50`, `dark:bg-gray-`) on container/card elements and fix any missed instances
- [x] T027 [P] Grep `src/` for any remaining `shadow-sm` on card/section containers (should be removed per the "No standard drop shadows" rule) and remove
- [x] T028 [P] Verify all heading elements (`h1`, `h2`, `h3`) across all 4 screens use `font-headline` class for Manrope rendering
- [x] T029 [P] Update `src/app/customers/[id]/page.tsx` — remove any outer border containers; update heading to `font-headline`; ensure surface tokens throughout

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1; BLOCKS all user story phases
- **Phase 3 (US1)**: Depends on Phase 2 — design tokens must exist before applying them; T007 (app-shell redesign) must complete before T014 (dashboard) and T023 (apply page)
- **Phase 4 (US2)**: Depends on Phase 2 + T007 from Phase 3 (sidebar must exist)
- **Phase 5 (US3)**: Depends on Phase 2; can run in parallel with Phase 4
- **Phase 6 (US4)**: Depends on Phase 2; can run in parallel with Phases 4 & 5
- **Phase 7 (US5)**: Depends on Phase 2 + T008 (loan-form restyling from Phase 3); can overlap with Phase 6
- **Phase 8 (Polish)**: Depends on all previous phases completing

### User Story Dependencies

- **US1 (P1)**: Only depends on Foundational (Phase 2) — start first
- **US2 (P2)**: Depends on T007 (app-shell sidebar) from US1
- **US3 (P3)**: Depends only on Phase 2 tokens — independent of US1 component work
- **US4 (P4)**: Depends only on Phase 2 tokens — independent of US1/US2/US3
- **US5 (P5)**: Depends on T008 (loan-form restyling) from US1

### Parallel Opportunities

- T008, T009, T010, T011, T012, T013 (Phase 3) — all touch different files, run in parallel after T006+T007
- T015, T016 (Phase 4) — different component files, run in parallel
- T018, T019 (Phase 5) — different files, run in parallel
- T021, T022 (Phase 6) — different files, run in parallel
- T026, T027, T028, T029 (Phase 8) — different concerns, run in parallel

---

## Parallel Example: User Story 1

```bash
# After T006 (layout.tsx body class) and T007 (app-shell sidebar) complete:
Task: T008 "Update loan-form.tsx — inputs and submit button"
Task: T009 "Update customer-select.tsx — border inputs to surface tokens"
Task: T010 "Update qualification-summary.tsx — border sections to surface tokens"
Task: T011 "Update status-lookup.tsx — border containers and button"
Task: T012 "Update app/page.tsx — home page surface tokens"
Task: T013 "Update app/status/page.tsx — surface tokens and success state"
# All six can run concurrently (different files, no shared state)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (baseline test run)
2. Complete Phase 2: Foundational (globals.css tokens + layout.tsx fonts)
3. Complete Phase 3: US1 (app-shell sidebar + base component token replacement)
4. **STOP and VALIDATE**: Visually inspect any page — surface background, Manrope headings, Material Symbols icons visible in sidebar
5. Proceed to Phase 4 if validated

### Incremental Delivery

1. Phase 1 + 2 → Token system in place (invisible until used)
2. Phase 3 (US1) → Sidebar layout + base token application everywhere (biggest visual change)
3. Phase 4 (US2) → Dashboard grid layout
4. Phase 5 (US3) → Customer directory badges
5. Phase 6 (US4) → Application detail warm-orange alert
6. Phase 7 (US5) → Apply page trust sidebar
7. Phase 8 → Regression confirmation + cleanup

### Suggested Parallel Execution

Once Phase 2 is complete and T007 (app-shell) from Phase 3 is done:
- **Track A**: T008–T013 (remaining US1 component updates)
- **Track B**: T014–T016 (US2 dashboard)
- **Track C**: T017–T019 (US3 customer directory)
- **Track D**: T020–T022 (US4 application detail)

---

## Notes

- [P] tasks = different files, no dependencies on each other in that phase
- [Story] label maps each task to its user story for traceability
- No new tests are generated — all 155 existing tests serve as the regression gate (run in Phase 1 and again in Phase 8)
- The Stitch HTML files in `/tmp/stitch_designs/stitch_loan_process_ui_design/` are the visual reference for all decisions
- Material Symbols icon names used: `account_balance`, `dashboard`, `description`, `group`, `settings`, `contact_support`, `logout`, `lock`, `check_circle`
- All `dark:bg-gray-*` and `dark:border-gray-*` classes on layout containers should be removed (light-mode primary target per spec Assumptions)
