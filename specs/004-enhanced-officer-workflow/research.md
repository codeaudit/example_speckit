# Research: Enhanced Officer Workflow

**Feature**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)
**Date**: 2026-03-25

## Research Tasks & Findings

### R1: Theme Toggle — Class-Based Dark Mode Override

**Context**: Feature 003 implemented dark mode via Tailwind CSS 4's default `prefers-color-scheme` media query. Feature 004 needs a manual toggle that overrides the system preference within the same session.

**Decision**: Switch from media-query-based dark mode to class-based dark mode using Tailwind CSS 4's `@custom-variant` directive, combined with a React context for state management.

**Rationale**:
- Tailwind CSS 4 supports `@variant dark (&:where(.dark, .dark *));` in CSS to switch from media-query to class-based dark mode
- A React context provider wraps the app and manages the `dark` class on `<html>`
- Default behavior: check `window.matchMedia('(prefers-color-scheme: dark)')` on mount — if no manual override, follow system preference
- Manual override: toggle adds/removes the `dark` class on `<html>` and stores the choice in context state (session-only, lost on tab close)
- All existing `dark:` utility classes continue to work unchanged — no component modifications needed
- The `scheme-light-dark` class remains for native form control theming; we also set `color-scheme` style property dynamically

**Alternatives considered**:
- **Keep media-query dark mode + CSS override**: Would require duplicating all dark styles with a `.dark` class selector — too fragile
- **localStorage persistence**: Rejected per spec clarification — session-only persistence required
- **Cookie-based persistence**: Unnecessary complexity for session-only requirement
- **next-themes library**: Rejected — spec requires no new dependencies

**Implementation approach**:
1. Add `@variant dark (&:where(.dark, .dark *));` to `globals.css`
2. Remove `scheme-light-dark` from `<html>` (class-based mode replaces it)
3. Create `src/lib/theme-context.tsx` — React context with `ThemeProvider` that:
   - On mount: reads `matchMedia` preference, applies `dark` class if needed
   - Exposes `theme` ('light' | 'dark') and `toggleTheme()` via context
   - Listens for system preference changes when no manual override is active
4. Create `src/components/theme-toggle.tsx` — button with sun/moon SVG icons
5. Wrap app in `ThemeProvider` in `layout.tsx` (requires converting to client boundary or using a wrapper component)

### R2: Email-Based Application Matching (SQL JOIN)

**Context**: Loan applications need to be linked to customers by matching `applicantEmail` in `loan_applications` to `email` in `customers`. No foreign key exists — matching is done at query time.

**Decision**: Use a SQL JOIN query in the new API endpoint to match applications to customers by email.

**Rationale**:
- The `customers.email` column has a UNIQUE constraint, making it an efficient join key
- `loan_applications.applicant_email` is not unique (a customer could have multiple applications) but is indexed implicitly by query patterns
- A simple `LEFT JOIN` or subquery on email provides all applications for a customer
- No schema changes needed — the relationship is purely query-time
- With 10 seed customers and up to 100 applications, performance is not a concern

**Alternatives considered**:
- **Add foreign key**: Would require schema migration and backfill — over-engineering for current scale
- **Application-side matching**: Fetch all applications and filter in JavaScript — less efficient, pushes logic to client
- **Materialized view**: Unnecessary for this data volume

**Query pattern**:
```sql
SELECT la.* FROM loan_applications la
INNER JOIN customers c ON la.applicant_email = c.email
WHERE c.id = ?
ORDER BY la.created_at DESC
```

### R3: Officer Page Restructuring Strategy

**Context**: The current `/officer` page shows a flat list of all applications via `ApplicationList`. It needs to show a customer list instead, with drill-down to customer detail + their applications.

**Decision**: Replace the `ApplicationList` usage on `/officer/page.tsx` with a new `OfficerCustomerList` component. Add a new page at `/officer/customer/[id]/page.tsx` for the customer detail + applications view.

**Rationale**:
- The existing `/officer/[id]/page.tsx` (application review with decision form) remains unchanged — it's already correctly scoped
- A new `OfficerCustomerList` component fetches customers with application counts from a modified `/api/customers` response or a dedicated query
- The customer detail page fetches customer profile + applications using the new API endpoint
- Navigation flow: `/officer` → `/officer/customer/[id]` → `/officer/[appId]` (for pending reviews)
- The `ApplicationList` component is no longer used by the officer page directly but remains in the codebase (may be used elsewhere or by the home page)

**Alternatives considered**:
- **Inline panels / accordion**: Rejected per spec clarification — separate pages preferred
- **Tabs on customer detail**: Over-engineering for the current scope
- **Reuse customer directory page**: Different context (officer has review actions, directory doesn't)

### R4: Customer Applications Count for Officer List

**Context**: The officer customer list needs to show each customer's name, email, and count of loan applications.

**Decision**: Extend the existing `/api/customers` endpoint with an optional `include=applicationCount` query parameter, or create the count via a SQL subquery.

**Rationale**:
- A subquery `(SELECT COUNT(*) FROM loan_applications WHERE applicant_email = c.email)` is efficient at this scale
- Adding the count to the existing customers endpoint avoids creating a separate endpoint just for counts
- The `OfficerCustomerList` component can fetch from `/api/customers?include=applicationCount`
- Alternatively, the officer page can fetch customers and then the count can come from a separate query — but a single query is simpler

**Decision refined**: Add application count directly to the `/api/customers` response as an optional field. The existing `CustomerSummary` type gains an optional `applicationCount?: number` field.

### R5: Theme Toggle Button Design

**Context**: The toggle button needs to visually indicate current theme state with distinct icons.

**Decision**: Use inline SVG icons — sun icon for "switch to light" (shown in dark mode) and moon icon for "switch to dark" (shown in light mode). No icon library dependency.

**Rationale**:
- Simple SVG paths for sun and moon are well-established patterns
- No dependency on icon libraries (Heroicons, Lucide, etc.)
- Button uses `aria-label` for accessibility: "Switch to dark mode" / "Switch to light mode"
- Positioned in the nav bar between the logo and navigation links, or at the end of the nav links

**Alternatives considered**:
- **Text-only toggle**: Less intuitive, takes more horizontal space
- **Icon library**: Spec requires no new dependencies
- **Toggle switch (checkbox)**: More complex markup for no UX benefit
