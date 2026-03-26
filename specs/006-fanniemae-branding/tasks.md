# Tasks: FannieMae UI Branding

**Input**: Design documents from `/specs/006-fanniemae-branding/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in the feature specification. Tests are omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Define FannieMae brand tokens and configure typography — foundation for all component updates

- [ ] T001 Define FannieMae brand color and typography tokens using @theme directive in src/app/globals.css — add all color tokens from data-model.md (brand-primary #23517C, brand-interactive #0C77BA, brand-interactive-alt #1C6FA3, text-primary #121212, text-muted #717171, bg-page #FFFFFF, bg-section #F3F5F9, bg-input #F1F1EF, border-default #CAC8C3, border-alt #7E8C9A, status-approved #16a34a, status-approved-bg #f0fdf4, status-rejected #dc2626, status-rejected-bg #fef2f2, status-pending #d97706, status-pending-bg #fffbeb) and set --font-family-sans to Source Sans Pro fallback stack
- [ ] T002 Remove @variant dark directive and dark mode animation keyframe overrides from src/app/globals.css
- [ ] T003 Configure Source Sans Pro font via next/font/google in src/app/layout.tsx — import Source_Sans_Pro with weights 400 and 700, subset latin, display swap; apply font className to the html element

---

## Phase 2: Foundational (Dark Mode Removal)

**Purpose**: Remove dark mode infrastructure — MUST complete before component updates to avoid referencing deleted modules

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Delete src/components/theme-toggle.tsx
- [ ] T005 Delete src/lib/theme-context.tsx
- [ ] T006 Update src/components/app-shell.tsx — remove ThemeProvider import and wrapper, remove ThemeToggle import and usage, replace "LoanPro" text with "LoanPro by Fannie Mae" branded header (LoanPro in text-lg font-bold text-brand-primary, "by Fannie Mae" in text-sm font-normal text-text-muted), replace gradient accent bar with flat bg-brand-primary, update nav link colors to text-brand-primary with hover:text-brand-interactive, update nav container bg to bg-bg-page with border-b border-border-default, strip all dark: class prefixes

**Checkpoint**: Dark mode fully removed, header rebranded, app still renders correctly with default Tailwind colors in components

---

## Phase 3: User Story 1 - Loan Officer Sees FannieMae-Branded Dashboard (Priority: P1) 🎯 MVP

**Goal**: Officer dashboard, application review, and decision workflow all use FannieMae brand colors, typography, and flat design

**Independent Test**: Open /officer, click into an application, review qualification metrics, and make a decision — all pages should visually match FannieMae's corporate blue palette with Source Sans Pro typography and no dark mode artifacts

### Implementation for User Story 1

- [ ] T007 [P] [US1] Update src/components/application-list.tsx — replace all Tailwind gray/blue color classes with brand tokens (bg-bg-section for card backgrounds, text-text-primary for body text, text-text-muted for secondary text, border-border-default for borders, text-brand-primary for headings), update status badges to use status token colors (bg-status-approved-bg text-status-approved, bg-status-rejected-bg text-status-rejected, bg-status-pending-bg text-status-pending), strip all dark: class prefixes
- [ ] T008 [P] [US1] Update src/components/application-detail.tsx — replace gray/blue color classes with brand tokens (bg-bg-section, text-text-primary, text-text-muted, border-border-default, text-brand-primary for headings), strip all dark: class prefixes
- [ ] T009 [P] [US1] Update src/components/qualification-summary.tsx — replace metric card colors with brand tokens (bg-bg-section for cards, text-brand-primary for metric labels, border-border-default for borders), update pass/fail badges to use status tokens (status-approved/status-rejected), strip all dark: class prefixes
- [ ] T010 [P] [US1] Update src/components/decision-form.tsx — replace form field colors with brand tokens (bg-bg-input for inputs, border-border-default for borders, focus:ring-brand-interactive for focus states), update approve button to bg-status-approved hover:opacity-90 and reject button to bg-status-rejected hover:opacity-90, update primary action button to bg-brand-primary hover:bg-brand-interactive, strip all dark: class prefixes
- [ ] T011 [P] [US1] Update src/components/officer-customer-list.tsx — replace table colors with brand tokens (text-text-primary, text-text-muted, border-border-default, bg-bg-section for alternating rows, text-brand-primary for links), strip all dark: class prefixes
- [ ] T012 [P] [US1] Update src/app/officer/page.tsx — replace page heading color to text-brand-primary, background to bg-bg-page, section backgrounds to bg-bg-section, strip all dark: class prefixes
- [ ] T013 [P] [US1] Update src/app/officer/[id]/page.tsx — replace heading colors to text-brand-primary, card backgrounds to bg-bg-section, borders to border-border-default, strip all dark: class prefixes
- [ ] T014 [P] [US1] Update src/app/officer/customer/[id]/page.tsx — replace heading colors to text-brand-primary, card backgrounds to bg-bg-section, link colors to text-brand-interactive, strip all dark: class prefixes

**Checkpoint**: Officer dashboard at /officer is fully FannieMae-branded — navigate through customer list, application detail, qualification summary, and decision form to verify

---

## Phase 4: User Story 2 - Borrower Experiences FannieMae-Branded Application Flow (Priority: P1)

**Goal**: Home page, loan application form, status lookup, and customer directory all use FannieMae brand colors and typography

**Independent Test**: Navigate to /, click Apply, fill out the form, submit, then check status at /status — all pages should visually match FannieMae branding with no dark mode artifacts

### Implementation for User Story 2

- [ ] T015 [P] [US2] Update src/app/page.tsx — replace heading colors to text-brand-primary, card backgrounds to bg-bg-section, card borders to border-border-default, card left accent borders to border-l-brand-primary, link colors to text-brand-interactive, body text to text-text-primary, strip all dark: class prefixes
- [ ] T016 [P] [US2] Update src/components/loan-form.tsx — replace form input backgrounds to bg-bg-input, borders to border-border-default, focus rings to focus:ring-brand-interactive/40, submit button to bg-brand-primary hover:bg-brand-interactive text-white, labels to text-text-primary, helper text to text-text-muted, strip all dark: class prefixes
- [ ] T017 [P] [US2] Update src/components/customer-select.tsx — replace select/input colors with brand tokens (bg-bg-input, border-border-default, focus:ring-brand-interactive/40, text-text-primary), strip all dark: class prefixes
- [ ] T018 [P] [US2] Update src/app/apply/page.tsx — replace page heading to text-brand-primary, background to bg-bg-page, strip all dark: class prefixes
- [ ] T019 [P] [US2] Update src/components/status-lookup.tsx — replace form colors with brand tokens (bg-bg-input for input, border-border-default, focus:ring-brand-interactive/40, bg-brand-primary for search button), update result card to bg-bg-section with border-border-default, status badges to use status tokens, strip all dark: class prefixes
- [ ] T020 [P] [US2] Update src/app/status/page.tsx — replace page heading to text-brand-primary, background to bg-bg-page, strip all dark: class prefixes
- [ ] T021 [P] [US2] Update src/components/customer-list.tsx — replace table colors with brand tokens (text-text-primary, text-text-muted, border-border-default, hover:bg-bg-section for rows, text-brand-interactive for links), strip all dark: class prefixes
- [ ] T022 [P] [US2] Update src/components/customer-detail.tsx — replace card colors with brand tokens (bg-bg-section, border-border-default, text-brand-primary for headings, text-text-primary for values, text-text-muted for labels), strip all dark: class prefixes
- [ ] T023 [P] [US2] Update src/components/customer-applications.tsx — replace table colors with brand tokens (border-border-default, text-text-primary, status tokens for badges), strip all dark: class prefixes
- [ ] T024 [P] [US2] Update src/app/customers/page.tsx — replace page heading to text-brand-primary, background to bg-bg-page, strip all dark: class prefixes
- [ ] T025 [P] [US2] Update src/app/customers/[id]/page.tsx — replace heading to text-brand-primary, background to bg-bg-page, strip all dark: class prefixes

**Checkpoint**: Borrower flow is fully FannieMae-branded — navigate home → apply → submit → check status, and browse customer directory to verify

---

## Phase 5: User Story 3 - Brand Tokens Are Centralized for Consistency (Priority: P2)

**Goal**: Verify all components reference brand tokens exclusively — no hardcoded Tailwind default colors remain

**Independent Test**: Change the brand-primary token value in globals.css @theme block to a visibly different color (e.g., red); reload any page; confirm all headings, nav links, and primary buttons reflect the changed color

### Implementation for User Story 3

- [ ] T026 [US3] Audit all components and pages for remaining hardcoded Tailwind default color classes (blue-600, blue-700, gray-900, gray-600, gray-50, etc.) — grep across src/ for non-token color references and replace any remaining instances with the corresponding brand token class
- [ ] T027 [US3] Verify no dark: class prefixes remain in any file under src/ — grep for "dark:" across all .tsx and .css files and remove any remaining instances

**Checkpoint**: Token centralization verified — changing a single token value in globals.css updates every page

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification across all user stories

- [ ] T028 [P] Verify WCAG 2.1 AA contrast ratios for all brand token combinations — check text-primary on bg-page, text-muted on bg-page, text-muted on bg-section, brand-primary on white, brand-interactive on white
- [ ] T029 [P] Verify Source Sans Pro renders correctly on all pages — check font-family in browser dev tools on each page, confirm weights 400 and 700 load correctly
- [ ] T030 Verify flat design compliance — confirm no CSS gradients remain (grep for gradient), shadows limited to shadow-sm, borders use border-default token
- [ ] T031 Run quickstart.md validation — walk through the complete implementation checklist in specs/006-fanniemae-branding/quickstart.md and confirm all items pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on T001-T003 completion — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion — can run in parallel with User Story 2
- **User Story 2 (Phase 4)**: Depends on Phase 2 completion — can run in parallel with User Story 1
- **User Story 3 (Phase 5)**: Depends on Phase 3 AND Phase 4 completion (audits the result of both)
- **Polish (Phase 6)**: Depends on Phase 5 completion

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 2 — no dependencies on other stories
- **User Story 2 (P1)**: Can start after Phase 2 — no dependencies on other stories
- **User Story 3 (P2)**: Depends on US1 AND US2 completion (verification/audit of their work)

### Within Each User Story

- All component tasks within US1 are parallelizable (different files, no shared state)
- All component tasks within US2 are parallelizable (different files, no shared state)
- US3 tasks are sequential (audit then verify)

### Parallel Opportunities

- T001, T002, T003 are sequential (T002 modifies same file as T001, T003 depends on font setup)
- T004, T005 can run in parallel (delete independent files)
- T007–T014 (all US1 tasks) can all run in parallel
- T015–T025 (all US2 tasks) can all run in parallel
- US1 and US2 can run in parallel with each other
- T028, T029 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all officer component updates together (all [P] tasks):
Task: "Update application-list.tsx with brand tokens" (T007)
Task: "Update application-detail.tsx with brand tokens" (T008)
Task: "Update qualification-summary.tsx with brand tokens" (T009)
Task: "Update decision-form.tsx with brand tokens" (T010)
Task: "Update officer-customer-list.tsx with brand tokens" (T011)
Task: "Update officer/page.tsx with brand tokens" (T012)
Task: "Update officer/[id]/page.tsx with brand tokens" (T013)
Task: "Update officer/customer/[id]/page.tsx with brand tokens" (T014)
```

## Parallel Example: User Story 2

```bash
# Launch all borrower component updates together (all [P] tasks):
Task: "Update home page.tsx with brand tokens" (T015)
Task: "Update loan-form.tsx with brand tokens" (T016)
Task: "Update customer-select.tsx with brand tokens" (T017)
Task: "Update apply/page.tsx with brand tokens" (T018)
Task: "Update status-lookup.tsx with brand tokens" (T019)
Task: "Update status/page.tsx with brand tokens" (T020)
Task: "Update customer-list.tsx with brand tokens" (T021)
Task: "Update customer-detail.tsx with brand tokens" (T022)
Task: "Update customer-applications.tsx with brand tokens" (T023)
Task: "Update customers/page.tsx with brand tokens" (T024)
Task: "Update customers/[id]/page.tsx with brand tokens" (T025)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (brand tokens + font)
2. Complete Phase 2: Foundational (dark mode removal + header rebrand)
3. Complete Phase 3: User Story 1 (officer dashboard)
4. **STOP and VALIDATE**: Open /officer and navigate through the full officer workflow
5. Deploy/demo if ready — officers see FannieMae-branded experience

### Incremental Delivery

1. Complete Setup + Foundational → Brand infrastructure ready
2. Add User Story 1 → Officer dashboard branded → Deploy/Demo (MVP!)
3. Add User Story 2 → Borrower flow branded → Deploy/Demo
4. Add User Story 3 → Token centralization verified → Deploy/Demo
5. Polish → Final quality pass → Ship

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (3 + 3 tasks)
2. Once Foundational is done:
   - Developer A: User Story 1 (T007–T014, 8 parallel tasks)
   - Developer B: User Story 2 (T015–T025, 11 parallel tasks)
3. Both complete → Developer A runs US3 audit (T026–T027)
4. Polish tasks split between team

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Every component task follows the same pattern: replace Tailwind defaults → brand tokens, strip dark: prefixes
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- The brand contract at contracts/ui-brand-contract.md is the acceptance reference for all visual verification
