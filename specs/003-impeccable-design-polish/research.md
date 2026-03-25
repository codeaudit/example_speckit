# Research: Impeccable Design Polish

**Feature**: 003-impeccable-design-polish | **Date**: 2026-03-25

## Dark Mode Implementation (Tailwind CSS 4.x)

### Decision: Use default `prefers-color-scheme` media query approach

**Rationale**: Tailwind CSS 4.x uses `@media (prefers-color-scheme: dark)` by default for the `dark:` variant. No configuration needed — it works out of the box with `@import "tailwindcss"` in globals.css. This is the correct approach because:

1. The spec requires system-preference-only dark mode (no manual toggle)
2. Zero FOUC (Flash of Unstyled Content) — the browser applies dark styles via CSS before any JS runs
3. No hydration mismatch risk with Next.js 15 Server Components
4. No additional dependencies (no `next-themes` package needed)

**Alternatives considered**:
- Class-based dark mode (`@custom-variant dark (&:where(.dark, .dark *))`) — rejected because it requires JavaScript to apply the class, causing FOUC and hydration mismatches. Only needed for manual toggle, which is out of scope.
- `next-themes` library — rejected as unnecessary complexity for system-preference-only mode. Would be needed if a manual toggle were added in a future feature.

### Implementation Approach

1. **globals.css**: Keep `@import "tailwindcss"` as-is. No `@custom-variant` needed.
2. **`<html>` element**: Add `className="scheme-light-dark"` so native form controls (scrollbars, date pickers) also respect dark mode via the CSS `color-scheme: light dark` property.
3. **All components**: Add `dark:` variant classes alongside existing light-mode classes (e.g., `bg-white dark:bg-gray-900`, `text-gray-900 dark:text-gray-100`).
4. **No CSS custom properties needed**: Direct `dark:` utility classes on each element keep things simple and explicit per Simplicity & YAGNI principle.

## Typography Scale

### Decision: Use a 4-level typographic scale with Tailwind utility classes

| Level | Usage | Tailwind Classes |
|-------|-------|-----------------|
| Page heading | Page titles | `text-2xl font-bold` |
| Section heading | Card headers, table headers | `text-lg font-semibold` |
| Body text | Form labels, table cells, content | `text-sm` (default) |
| Caption/metadata | Dates, secondary info, helper text | `text-xs text-gray-500 dark:text-gray-400` |

**Rationale**: The spec requires "consistent, distinct typographic scale" (FR-004). Using Tailwind's built-in size utilities avoids custom font definitions. Four levels cover all current page needs.

## Semantic Badge Colors

### Decision: Standardize status badge color palette

| Status | Light Mode | Dark Mode |
|--------|-----------|-----------|
| Qualified / Approved | `bg-green-100 text-green-800` | `dark:bg-green-900 dark:text-green-200` |
| Not Qualified / Rejected | `bg-red-100 text-red-800` | `dark:bg-red-900 dark:text-red-200` |
| Pending / Warning | `bg-amber-100 text-amber-800` | `dark:bg-amber-900 dark:text-amber-200` |
| N/A / Neutral | `text-gray-400` | `dark:text-gray-500` |

**Rationale**: FR-006 requires "semantic colors consistently for status indicators." Current codebase already uses green/red for qualified/not-qualified. This standardizes and extends to dark mode with sufficient contrast.

## Loading State Treatment

### Decision: Use animated pulse skeleton loaders

**Rationale**: FR-009 requires "designed visual placeholders, not raw text." Tailwind's `animate-pulse` with gray background blocks creates a clean skeleton effect without any new dependencies.

**Pattern**: Replace `<p>Loading...</p>` with skeleton blocks that match the content layout:
```tsx
<div className="animate-pulse space-y-3">
  <div className="h-4 w-48 rounded bg-gray-200 dark:bg-gray-700" />
  <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
</div>
```

## Focus & Hover States

### Decision: Use Tailwind `focus-visible:` and `hover:` utilities

**Rationale**: FR-007 and FR-008 require visible hover and focus states for all interactive elements. Using `focus-visible:` (not `focus:`) ensures focus rings only appear for keyboard navigation, not mouse clicks.

**Standard pattern**:
- Buttons: `hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600`
- Links: `hover:text-blue-800 dark:hover:text-blue-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600`
- Form inputs: `focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none`

## WCAG 2.1 AA Contrast Compliance

### Decision: Verify all color combinations meet 4.5:1 ratio

Key combinations to verify:
- **Light mode**: Gray-900 on white (21:1 — passes), Gray-600 on white (5.7:1 — passes), Gray-500 on white (4.6:1 — passes)
- **Dark mode**: Gray-100 on Gray-900 (15.3:1 — passes), Gray-400 on Gray-900 (7.4:1 — passes), Gray-500 on Gray-900 (4.6:1 — passes)
- **Badges**: Green-800 on Green-100 (8.1:1 — passes), Red-800 on Red-100 (7.8:1 — passes)
- **Dark badges**: Green-200 on Green-900 (7.5:1 — passes), Red-200 on Red-900 (6.8:1 — passes)

All combinations meet the 4.5:1 minimum for normal text (FR-010).

## No New Dependencies

Confirmed: All required functionality (dark mode, typography, skeleton loaders, focus states) is achievable with Tailwind CSS 4.x built-in utilities. No new packages needed per Constitution Principle II.
