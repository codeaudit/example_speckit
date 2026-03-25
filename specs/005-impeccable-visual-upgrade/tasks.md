# Tasks: Impeccable Visual Upgrade

**Input**: Design documents from `/specs/005-impeccable-visual-upgrade/`
**Prerequisites**: plan.md, spec.md, research.md, quickstart.md

**Tests**: Not included — this is a visual-only CSS upgrade. All 101 existing tests must continue to pass (verified in Polish phase). Visual verification via quickstart.md scenarios.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story. All changes are Tailwind CSS class modifications to existing files plus CSS keyframes/utilities in globals.css.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single Next.js project**: `src/` at repository root
- No new files expected — all modifications to existing files

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add CSS animation keyframes, transition utilities, and `prefers-reduced-motion` override to globals.css. These are shared by all user stories.

- [x] T001 Add animation keyframes and reduced-motion override to src/app/globals.css — add `@keyframes fade-in-up` (opacity 0 + translateY(8px) → opacity 1 + translateY(0), 300ms), `@keyframes shake` (horizontal oscillation, 400ms), corresponding `@utility` classes `animate-fade-in-up` and `animate-shake`, and a `@media (prefers-reduced-motion: reduce)` block that sets `transition-duration: 0.01ms !important` and `animation-duration: 0.01ms !important` on all elements

---

## Phase 2: User Story 1 — Elevated Home Page & Navigation (Priority: P1) 🎯 MVP

**Goal**: Navigation bar has a subtle accent element, home page hero section communicates premium quality, and action cards have smooth hover transitions with depth cues.

**Independent Test**: Navigate to home page → see refined nav with accent line → view hero section with clear typographic hierarchy → hover over cards → observe smooth lift/shadow transitions → verify dark mode → verify mobile layout.

### Implementation for User Story 1

- [x] T002 [P] [US1] Add navigation bar accent and depth in src/components/app-shell.tsx — add a thin gradient accent line below the nav (`h-0.5 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400` with `dark:from-blue-400 dark:via-blue-500 dark:to-blue-600`), add `shadow-sm` to the nav for subtle depth, ensure dark mode rendering is correct
- [x] T003 [P] [US1] Upgrade home page hero section and card hover effects in src/app/page.tsx — enhance headline to `text-3xl font-bold tracking-tight` with a supporting subheading that has more visual weight, add `transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg` to cards, add left border accent on hover (`border-l-2 border-l-transparent hover:border-l-blue-500 dark:hover:border-l-blue-400`), ensure cards stack properly on mobile (below 640px), dark mode with `dark:hover:shadow-gray-900/50`

**Checkpoint**: Nav accent visible, hero section polished, cards have smooth hover lift with accent. All effects work in both light and dark modes. Mobile layout intact.

---

## Phase 3: User Story 2 — Polished Forms & Interactive Elements (Priority: P2)

**Goal**: Form inputs have smooth focus transitions, buttons have three distinct states (rest, hover, active), and form submission success/error feedback uses entrance animations.

**Independent Test**: Navigate to /apply → focus on form fields → observe smooth focus ring transition → hover and click submit button → observe hover and pressed states → submit valid form → see animated success → submit invalid → see animated errors → verify dark mode.

### Implementation for User Story 2

- [x] T004 [P] [US2] Upgrade form input focus transitions in src/components/loan-form.tsx — update `fieldClass` to include `transition-all duration-150` and replace `focus-visible:ring-2 focus-visible:ring-blue-600` with `focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 dark:focus:ring-blue-400/40 dark:focus:border-blue-400` for smooth focus ring appearance, add `ring-0 ring-blue-500/0` to base state so transition has start/end values
- [x] T005 [P] [US2] Upgrade form input focus transitions in src/components/status-lookup.tsx — apply same focus transition pattern as T004 to the reference number input field and search button
- [x] T006 [P] [US2] Upgrade form input focus transitions in src/components/decision-form.tsx — apply same focus transition pattern as T004 to the textarea field
- [x] T007 [P] [US2] Upgrade button states across all form components — in src/components/loan-form.tsx: add `transition-all duration-150 hover:shadow-md active:scale-[0.98] active:shadow-none` to the submit button. In src/components/status-lookup.tsx: same treatment for the search button. In src/components/decision-form.tsx: same treatment for Approve and Reject buttons. Ensure dark mode hover/active states work correctly.
- [x] T008 [US2] Add entrance animations to form success and error states in src/components/loan-form.tsx — apply `animate-fade-in-up` class to generalError div and to the success callback display (if rendered in the parent page, update src/app/apply/page.tsx success message). Apply `animate-shake` or `animate-fade-in-up` to individual field error messages. Ensure error field borders transition to error color with `transition-colors duration-150`.
- [x] T009 [P] [US2] Add entrance animations to status lookup results in src/components/status-lookup.tsx — apply `animate-fade-in-up` class to the result card, notFound message, and error message divs
- [x] T010 [P] [US2] Add entrance animations to decision form feedback in src/components/decision-form.tsx — apply `animate-fade-in-up` class to the error message div and to the "Decision Made" display when an existing decision is shown
- [x] T011 [US2] Upgrade customer-select dropdown styling in src/components/customer-select.tsx — apply same focus transition pattern as T004 to the select element, add `transition-all duration-150` for smooth interaction

**Checkpoint**: All form inputs have smooth focus transitions. Buttons have hover + pressed states. Success/error messages animate in. All effects work in dark mode.

---

## Phase 4: User Story 3 — Data Table & Badge Visual Refinement (Priority: P3)

**Goal**: Table rows have smooth hover transitions, status and qualification badges have distinctive depth treatment, and data presentation feels premium.

**Independent Test**: Navigate to /officer → hover over customer list rows → observe smooth highlight transitions → click customer → view application table with refined badges → verify badge depth treatment → verify dark mode.

### Implementation for User Story 3

- [x] T012 [P] [US3] Add smooth hover transitions to officer customer list table in src/components/officer-customer-list.tsx — add `transition-colors duration-150` to each `<tr>` element so the existing `hover:bg-gray-50 dark:hover:bg-gray-700/50` transitions smoothly instead of instantly
- [x] T013 [P] [US3] Add smooth hover transitions and badge refinement to customer applications table in src/components/customer-applications.tsx — add `transition-colors duration-150` to each `<tr>`, upgrade badge classes to include `shadow-sm ring-1 ring-inset` with color-matched rings: qualification badges get `ring-green-200/50 dark:ring-green-400/20` (Qualified), `ring-red-200/50 dark:ring-red-400/20` (Not Qualified), `ring-gray-200/50 dark:ring-gray-400/20` (N/A); status badges get `ring-amber-200/50 dark:ring-amber-400/20` (Pending), `ring-green-200/50 dark:ring-green-400/20` (Approved), `ring-red-200/50 dark:ring-red-400/20` (Rejected)
- [x] T014 [P] [US3] Add smooth hover transitions to customer list in src/components/customer-list.tsx — add `transition-colors duration-150` to table rows for smooth hover highlight
- [x] T015 [P] [US3] Upgrade badge styling in src/components/application-list.tsx — add `transition-colors duration-150` to table rows, add `shadow-sm ring-1 ring-inset` with color-matched rings to status badges (same pattern as T013)
- [x] T016 [P] [US3] Upgrade badge styling in src/components/application-detail.tsx — add `shadow-sm ring-1 ring-inset` with color-matched ring to the status badge display
- [x] T017 [P] [US3] Upgrade badge styling in src/components/qualification-summary.tsx — add `shadow-sm ring-1 ring-inset` with color-matched ring to qualification result badge
- [x] T018 [P] [US3] Upgrade badge styling in src/components/status-lookup.tsx — add `shadow-sm ring-1 ring-inset` with color-matched ring to the status badge in the search result display

**Checkpoint**: All table rows have smooth hover transitions. All badges across the application have consistent depth treatment with shadow and ring. All effects work in dark mode.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across all stories

- [x] T019 Run full test suite (`npm test`) and verify all existing 101 tests pass with no regressions
- [x] T020 Run production build (`npm run build`) and verify no build errors
- [x] T021 Run quickstart.md verification — follow all 7 scenarios in specs/005-impeccable-visual-upgrade/quickstart.md across light and dark modes
- [x] T022 Verify edge cases from spec — rapid hover across table rows (no artifacts), touch device usability (hover is enhancement only), prefers-reduced-motion (all animations instant), badge text overflow ("Not Qualified" fits), wide screen layout (centered via max-w-5xl)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **US1 (Phase 2)**: Depends on Setup (T001 for CSS keyframes/utilities)
- **US2 (Phase 3)**: Depends on Setup (T001 for animation classes)
- **US3 (Phase 4)**: Depends on Setup (T001 for reduced-motion override)
- **Polish (Phase 5)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Independent after Setup — nav and home page only
- **US2 (P2)**: Independent after Setup — forms and buttons only
- **US3 (P3)**: Independent after Setup — tables and badges only
- All three user stories can run in parallel after T001

### Within Each User Story

- US1: T002 and T003 can run in parallel (different files)
- US2: T004, T005, T006, T007 can run in parallel (different files), then T008 (depends on T004 for field class pattern), T009, T010, T011 can run in parallel
- US3: All tasks (T012–T018) can run in parallel (all different files)

### Parallel Opportunities

- Phase 1: Single task (T001)
- Phase 2 (US1): T002 and T003 in parallel
- Phase 3 (US2): T004, T005, T006, T007 in parallel; then T008, T009, T010, T011 in parallel
- Phase 4 (US3): T012, T013, T014, T015, T016, T017, T018 all in parallel
- US1, US2, and US3 can all run in parallel after Setup

---

## Parallel Example: All User Stories After Setup

```bash
# After Setup (T001), launch all three user stories in parallel:

# Stream A (US1 — Nav + Home):
Task: T002 "Nav bar accent in app-shell.tsx"
Task: T003 "Hero section + card hover in page.tsx"

# Stream B (US2 — Forms):
Task: T004 "Loan form focus transitions"
Task: T005 "Status lookup focus transitions"
Task: T006 "Decision form focus transitions"
Task: T007 "Button states across all forms"
# Then:
Task: T008 "Loan form success/error animations"
Task: T009 "Status lookup result animations"
Task: T010 "Decision form feedback animations"
Task: T011 "Customer-select dropdown styling"

# Stream C (US3 — Tables + Badges):
Task: T012-T018 (all 7 tasks in parallel — each targets a different file)
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1: Setup (CSS keyframes + reduced-motion)
2. Complete Phase 2: US1 (nav accent + hero + card hover)
3. **STOP and VALIDATE**: Test home page visually in light/dark modes
4. Demo if ready

### Incremental Delivery

1. Setup → CSS infrastructure ready
2. Add US1 → Nav + home page polished → Demo (MVP!)
3. Add US2 → Forms and buttons refined → Demo
4. Add US3 → Tables and badges elevated → Demo (full feature)
5. Polish → Final validation, all tests pass → Ship

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- No new tests — all 101 existing tests validate functional behavior is unchanged
- Visual verification via quickstart.md scenarios (7 scenarios covering all stories + edge cases)
- No new dependencies — all effects use Tailwind CSS utilities + 2 CSS keyframes
- No new component files — all modifications to existing files
- `prefers-reduced-motion` override is global in globals.css — covers all stories automatically
