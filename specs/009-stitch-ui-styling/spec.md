# Feature Specification: Stitch UI Styling

**Feature Branch**: `009-stitch-ui-styling`
**Created**: 2026-03-27
**Status**: Draft
**Input**: User description: "change the styling of the UI, implement it according to the style in stitch_loan_process_ui_design"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Design Token Foundation (Priority: P1)

A loan officer opens the application and immediately sees a cohesive, premium visual language: deep authoritative blue as the primary brand color, layered surface backgrounds instead of bordered boxes, Manrope editorial headlines, and Inter body text — all consistent with the "Architectural Curator" design system from the Stitch mockups.

**Why this priority**: All other visual work depends on the global CSS token layer being correct. Without the right design tokens (`--color-primary`, surface hierarchy, typography scale, signature gradient), every component will render with incorrect colors, fonts, and spacing.

**Independent Test**: Load the application in a browser. The page background should be `#f8f9fa`, cards should be white (`#ffffff`) on a `#f3f4f5` section layer, and all headings should render in Manrope. No 1px solid grey borders should be visible separating sections.

**Acceptance Scenarios**:

1. **Given** the application is loaded, **When** a user views any page, **Then** page background is `#f8f9fa`, card surfaces are `#ffffff`, and section groupings use `#f3f4f5` — no hard borders defining layout regions.
2. **Given** the application is loaded, **When** a user views any heading (h1–h3), **Then** the font family renders as Manrope.
3. **Given** the application is loaded, **When** a user views body text or labels, **Then** the font family renders as Inter.
4. **Given** the application is loaded, **When** a user views the primary CTA button, **Then** it displays a gradient from `#003464` to `#1a4b82` at 135 degrees (signature gradient).
5. **Given** a modal or dropdown is open, **When** the user views it, **Then** it renders with glassmorphism: semi-transparent background with backdrop blur.

---

### User Story 2 - Officer Dashboard & Sidebar Visual Alignment (Priority: P2)

A loan officer using the dashboard sees the layout precisely match the Stitch intelligence dashboard mockup: a navy sidebar with Material Symbols icons, KPI cards in an 8/4 grid, a Market Pulse card with analytics icon watermark, and activity feed — all without any visible dividers between sections.

**Why this priority**: The officer dashboard is the primary landing screen for the key user persona. It must be visually faithful to the Stitch mockup to establish trust in the design system.

**Independent Test**: Navigate to `/officer`. The sidebar renders with `account_balance`, `dashboard`, `description`, `group`, `settings`, `contact_support`, and `logout` Material Symbols icons. KPI cards occupy 8 columns, Market Pulse occupies 4 columns. No horizontal divider lines appear in the activity feed.

**Acceptance Scenarios**:

1. **Given** a loan officer is on the dashboard, **When** the page loads, **Then** the sidebar shows all 7 icon slots with correct Material Symbols icons and the `account_balance` logo icon.
2. **Given** a loan officer is on the dashboard, **When** the page loads, **Then** KPI summary cards appear in an 8-column section and the Market Pulse risk card appears in a 4-column section.
3. **Given** a loan officer is on the dashboard, **When** viewing the activity feed, **Then** entries are separated by `1rem` vertical spacing only — no `<hr>` or border-bottom rules.

---

### User Story 3 - Customer Directory Visual Alignment (Priority: P3)

A loan officer browsing the customer directory sees each customer row styled per the Stitch customer directory mockup: status badges using background-color-only pill shapes (no border), VIP customers in blue-100, customers needing attention in amber-100, new customers in emerald-100 — all on a clean borderless list.

**Why this priority**: Customer directory is the second most-visited officer screen. Consistent badge semantics reinforce meaning across the product.

**Independent Test**: Navigate to `/customers`. Status badges use `bg-blue-100 text-blue-800` for VIP, `bg-amber-100 text-amber-800` for needs-attention, and `bg-emerald-100 text-emerald-800` for new. No row separators visible as 1px lines.

**Acceptance Scenarios**:

1. **Given** a loan officer views the customer directory, **When** a customer has VIP status, **Then** the badge displays `bg-blue-100 text-blue-800` with rounded pill shape, no border.
2. **Given** a loan officer views the customer directory, **When** a customer needs attention, **Then** the badge displays `bg-amber-100 text-amber-800`.
3. **Given** a loan officer views the customer directory, **When** rows separate, **Then** separation is achieved by spacing or alternating surface tones — not visible borders.

---

### User Story 4 - Application Detail Visual Alignment (Priority: P4)

A loan officer reviewing a loan application sees the 3-column detail layout from the Stitch mockup: a left navigation sidebar with `border-l-2` active section indicator, main content area with border-free section groupings, and the Interest Rate Lock alert using warm orange (`bg-tertiary-fixed`) — not blue.

**Why this priority**: The application detail view is where high-stakes decisions are made. Correct color semantics (warm orange for the rate lock, not blue) prevent misreading of urgency signals.

**Independent Test**: Navigate to an application detail page. The Interest Rate Lock alert card uses `background: #ffdcc1` (tertiary-fixed). The left section navigation shows the active item with a `border-l-2 border-primary` indicator. The 5-item required documents checklist renders without inter-item borders.

**Acceptance Scenarios**:

1. **Given** a loan officer is on an application detail, **When** viewing the Interest Rate Lock section, **Then** the card background is `#ffdcc1` (tertiary-fixed warm orange).
2. **Given** a loan officer is on an application detail, **When** a left-nav section is active, **Then** it shows `border-l-2 border-primary` with `text-primary` label — not an underline or background fill.
3. **Given** a loan officer is on an application detail, **When** viewing the required documents list, **Then** items are separated by spacing alone with no visible dividers.

---

### User Story 5 - Borrower Application Form Visual Alignment (Priority: P5)

A borrower filling out a loan application sees the 2-column Stitch form layout: the form occupies 8 of 12 columns, a "Secure Verification" sidebar trust panel (gradient blue card with warm orange check icons) occupies 4 columns, and the loan journey stepper shows the active step with a warm orange circle (`bg-tertiary-fixed`), not blue.

**Why this priority**: The borrower apply page directly impacts conversion. The Stitch trust panel design is specifically engineered to reduce drop-off anxiety.

**Independent Test**: Navigate to `/apply`. The page shows a 12-column grid layout — 8 columns for the form, 4 columns for the sidebar. The Secure Verification sidebar has the signature blue gradient background. The loan progress stepper's active circle is `bg-tertiary-fixed` (#ffdcc1 warm orange), not `bg-primary` blue.

**Acceptance Scenarios**:

1. **Given** a borrower is on the apply page, **When** the page loads on a large screen, **Then** the form occupies 8 columns and the trust sidebar occupies 4 columns.
2. **Given** a borrower is on the apply page, **When** viewing the loan stepper, **Then** the active step circle renders with warm orange background (`#ffdcc1`), not blue.
3. **Given** a borrower is on the apply page, **When** viewing the Secure Verification sidebar, **Then** it renders with the signature gradient (`linear-gradient(135deg, #003464, #1a4b82)`) and warm orange check icons.

---

### Edge Cases

- What happens when Manrope/Inter fonts fail to load from Google Fonts? The system falls back to `system-ui, sans-serif` without layout shift.
- What happens on mobile viewports where the 12-column layout collapses? Sidebar navigation remains accessible and surface tokens stay correct at all breakpoints.
- What if a component still references a legacy token (`brand-primary`, `bg-page`)? The component renders with an undefined/transparent value, making the regression immediately visible.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The global CSS file MUST define the full Architectural Curator token set: `--color-primary: #003464`, `--color-primary-container: #1a4b82`, `--color-tertiary-fixed: #ffdcc1`, `--color-tertiary: #502a00`, and the four surface layers (`surface: #f8f9fa`, `surface-container-low: #f3f4f5`, `surface-container-lowest: #ffffff`, `surface-container-high: #e7e8e9`).
- **FR-002**: The global CSS file MUST define a `signature-gradient` utility (`linear-gradient(135deg, #003464 0%, #1a4b82 100%)`) and a `glass-effect` glassmorphism utility (semi-transparent surface with backdrop blur).
- **FR-003**: The layout MUST load Manrope (weights 400–800) and Inter (weights 400–600) as headline and body fonts with correct CSS variable assignments (`--font-headline`, `--font-body`).
- **FR-004**: The global CSS MUST include the `.material-symbols-outlined` rendering rule (`font-variation-settings` defaults) to ensure icons display correctly.
- **FR-005**: All section and layout boundaries across all screens MUST be defined by background color shifts between surface layers — not 1px solid borders.
- **FR-006**: All list and feed item separations MUST use vertical spacing (`gap`, `space-y`, or `margin`) — not `<hr>` or `border-bottom` CSS rules.
- **FR-007**: The officer sidebar MUST render Material Symbols icons for all 7 slots: logo (`account_balance`), nav links (`dashboard`, `description`, `group`, `settings`), and bottom actions (`contact_support`, `logout`).
- **FR-008**: Customer status badges MUST use background-color-only pill styling — `bg-blue-100 text-blue-800` for VIP, `bg-amber-100 text-amber-800` for needs-attention, `bg-emerald-100 text-emerald-800` for new.
- **FR-009**: The Interest Rate Lock alert in application detail MUST use `bg-tertiary-fixed` (warm orange `#ffdcc1`) as its background — not `bg-primary` blue.
- **FR-010**: The loan application stepper's active step circle MUST use `bg-tertiary-fixed text-tertiary` styling — not `bg-primary text-white`.
- **FR-011**: The borrower apply page MUST render a 2-column layout (8/4 grid on large screens) with a Secure Verification trust sidebar using the signature gradient background.
- **FR-012**: Primary CTA buttons MUST use the signature gradient; secondary buttons MUST use no fill with ghost border only; tertiary actions MUST use `text-primary` with no border or fill.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 12 functional requirements are verifiable by visual inspection — zero 1px solid grey borders define layout sections across all four primary screens (dashboard, customer directory, application detail, apply form).
- **SC-002**: The complete Architectural Curator palette (12+ semantic color tokens) is defined in `globals.css` — no components reference legacy tokens (`brand-primary`, `text-primary`, `bg-page`, `bg-section`).
- **SC-003**: Material Symbols icons are visible in the officer sidebar across all 7 icon slots — confirming the icon font is loading and the CSS rendering rule is applied.
- **SC-004**: All existing unit tests (155+) continue to pass after styling changes — zero regressions in component behavior or data logic.
- **SC-005**: The application loads with fonts rendered in under 2 seconds on standard broadband — no invisible text flash lasting more than 500ms.

## Assumptions

- The Stitch HTML mockup files in `stitch_loan_process_ui_design/` are the authoritative visual reference; any ambiguity is resolved by inspecting those files directly.
- Google Fonts (Manrope, Inter, Material Symbols Outlined) are already configured in `src/app/layout.tsx` from a prior implementation pass — no layout.tsx changes are required.
- No new database schema changes are required — this feature is purely visual/CSS.
- Dark mode support is not in scope for this styling pass; light mode is the primary target.
- All legacy design tokens (`brand-primary`, `text-primary`, `bg-page`, etc.) that exist in `globals.css` must be fully replaced and not left as dead code.
- Tailwind CSS 4.x `@theme` directive is the mechanism for injecting CSS custom properties into the Tailwind token system.
