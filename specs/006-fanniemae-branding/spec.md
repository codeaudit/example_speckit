# Feature Specification: FannieMae UI Branding

**Feature Branch**: `006-fanniemae-branding`
**Created**: 2026-03-26
**Status**: Draft
**Input**: User description: "Revise the UI so that it supports FannieMae branding. Use their website to pick up styles and icons: https://www.fanniemae.com/"

## Clarifications

### Session 2026-03-26

- Q: Should the app support dark mode, or match FannieMae's light-only website? → A: Drop dark mode entirely to match FannieMae's light-only institutional aesthetic.
- Q: What should the application header identity be? → A: "LoanPro by Fannie Mae" -- retain app identity with brand endorsement.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Loan Officer Sees FannieMae-Branded Dashboard (Priority: P1)

A loan officer opens the LoanPro application and immediately recognizes the interface as a FannieMae-branded product. The color palette, typography, and overall visual tone reflect FannieMae's corporate identity -- dark blue primary colors, Source Sans Pro font, clean flat design with generous whitespace. Navigation, headers, status badges, and action buttons all use the FannieMae color system.

**Why this priority**: Brand consistency is the core deliverable. If the dashboard doesn't look like a FannieMae product, the rebrand has failed.

**Independent Test**: Can be fully tested by opening the officer dashboard and visually comparing the color palette, typography, and layout against FannieMae's website. Delivers immediate brand alignment value.

**Acceptance Scenarios**:

1. **Given** a loan officer navigates to the dashboard, **When** the page loads, **Then** the header displays the FannieMae brand colors (#23517C primary blue) and Source Sans Pro typography
2. **Given** a loan officer views the dashboard, **When** they scan the interface, **Then** all status badges use the FannieMae color system (blues for primary actions, semantic greens/reds/ambers for status)

---

### User Story 2 - Borrower Experiences FannieMae-Branded Application Flow (Priority: P1)

A borrower accessing the loan application form sees a clean, trustworthy interface that reflects FannieMae's institutional brand. Form inputs, buttons, labels, and confirmation screens all use the FannieMae visual language -- restrained corporate styling that conveys trust and professionalism.

**Why this priority**: Borrower-facing pages are equally important for brand consistency. Borrowers interacting with a FannieMae-branded product need to feel confidence and trust.

**Independent Test**: Can be fully tested by navigating the borrower application flow end-to-end and verifying brand elements at each step.

**Acceptance Scenarios**:

1. **Given** a borrower opens the application form, **When** the page loads, **Then** the form uses FannieMae typography (Source Sans Pro), brand blue (#23517C) for headings, and the FannieMae section background color (#F3F5F9) for content areas
2. **Given** a borrower submits an application, **When** the confirmation page displays, **Then** it uses FannieMae brand styling consistently with the rest of the application
3. **Given** a borrower views the application on a mobile device, **When** the responsive layout adjusts, **Then** brand elements remain consistent and recognizable

---

### User Story 3 - Brand Tokens Are Centralized for Consistency (Priority: P2)

All FannieMae brand values (colors, fonts, spacing conventions) are defined in a single location so that every page and component draws from the same source of truth. Changing a brand color in one place updates it everywhere.

**Why this priority**: Centralized tokens prevent brand drift across pages and make future updates efficient, but the user-facing brand experience (P1 stories) must come first.

**Independent Test**: Can be tested by changing a single color token and verifying it updates across all pages.

**Acceptance Scenarios**:

1. **Given** the brand tokens are defined centrally, **When** a brand color value is updated, **Then** the change reflects on all pages that use that color
2. **Given** a new component is added, **When** a developer references the brand palette, **Then** they find all FannieMae colors, fonts, and spacing values in one canonical location

---

### Edge Cases

- What happens when the browser does not support Source Sans Pro? The system falls back to a sans-serif system font that maintains readability.
- How does the FannieMae color palette adapt for users with high-contrast accessibility settings? Semantic colors (status indicators) maintain sufficient contrast ratios in the light theme.
- What happens if a component uses a color not defined in the FannieMae palette? The component uses the nearest FannieMae palette equivalent rather than introducing off-brand colors.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST use FannieMae's primary brand color (#23517C) for primary headings, navigation elements, and key interactive components
- **FR-002**: System MUST use FannieMae's interactive blue (#0C77BA) for hover states and clickable links
- **FR-003**: System MUST use Source Sans Pro as the primary typeface with weights 400 (regular) and 700 (bold)
- **FR-004**: System MUST use the FannieMae neutral palette (#121212 for body text, #717171 for muted/secondary text, #F3F5F9 for section backgrounds, #CAC8C3 for borders)
- **FR-005**: System MUST maintain semantic status colors (green for approved/qualified, red for rejected/not-qualified, amber for warnings) while harmonizing them with the FannieMae cool-toned palette
- **FR-006**: System MUST apply flat design principles consistent with FannieMae's aesthetic -- no gradients, minimal shadows, clean spacing
- **FR-007**: System MUST use a light-only theme to match FannieMae's institutional aesthetic; any existing dark mode toggle MUST be removed
- **FR-008**: System MUST display "LoanPro by Fannie Mae" as the branded header identity, with "LoanPro" as the primary app name and "by Fannie Mae" as the brand endorsement
- **FR-009**: System MUST use understated, line-style iconography consistent with FannieMae's utilitarian icon approach
- **FR-010**: System MUST maintain WCAG 2.1 AA color contrast ratios for all text and interactive elements in the light theme

### Key Entities

- **Brand Token Set**: The centralized collection of FannieMae brand values -- colors (primary, secondary, semantic, neutral), typography (font family, weights, sizes, line heights), spacing units, and border treatments
- **Theme Configuration**: Light-only theme applying the brand token set consistently across all pages

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All pages in the application use only colors from the defined FannieMae brand palette -- zero off-brand color values
- **SC-002**: 100% of text elements use Source Sans Pro (or the defined fallback) as their font family
- **SC-003**: All interactive elements (buttons, links, form controls) use the FannieMae interactive blue (#0C77BA) for hover/focus states
- **SC-004**: All text and interactive elements meet WCAG 2.1 AA contrast ratios (4.5:1 for normal text, 3:1 for large text) in the light theme
- **SC-005**: A user familiar with FannieMae's website can identify the application as FannieMae-branded within 3 seconds of viewing any page
- **SC-006**: Brand color values are defined in a single canonical location -- updating one value changes it across all pages

## Assumptions

- The existing application layout, component structure, and functionality remain unchanged -- this is a visual rebrand only, not a UX restructuring
- The header brand identity "LoanPro by Fannie Mae" will be rendered as styled text rather than requiring licensed logo image assets
- Source Sans Pro is freely available via Google Fonts and can be loaded in the application
- The existing dark mode toggle will be removed; the application will be light-only to match FannieMae's website
- Semantic status colors (green/red/amber for loan qualification status) will be retained but harmonized with the FannieMae cool-toned palette to avoid visual clashes
- The "Powering America's Housing" tagline will not be used unless explicitly requested, as this is a loan processing tool rather than a marketing site
