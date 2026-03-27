# Implementation Plan: Stitch UI Styling

**Branch**: `009-stitch-ui-styling` | **Date**: 2026-03-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/009-stitch-ui-styling/spec.md`

## Summary

Apply the "Architectural Curator" design system from the Stitch HTML mockups across the entire LoanPro UI. The work is purely visual/CSS: update the global token layer in `globals.css`, load the correct fonts and icon font in `layout.tsx`, redesign the `AppShell` into a sidebar layout for officer views, and restyle each screen to use surface-layer depth instead of 1px borders. No schema changes, no new npm dependencies.

## Technical Context

**Language/Version**: TypeScript 6.x (strict mode)
**Primary Dependencies**: Next.js 16.2.1 (App Router), Tailwind CSS 4.2.2, React 19.2.4, better-sqlite3, Vitest 3.x
**Storage**: SQLite (no changes)
**Testing**: Vitest 3.x + React Testing Library
**Target Platform**: Web (light-mode primary, responsive)
**Project Type**: Web application (Next.js)
**Performance Goals**: Font render in <500ms (no FOIT)
**Constraints**: Zero new npm dependencies; all 155 existing tests must continue to pass
**Scale/Scope**: 4 primary screens, ~15 components

## Constitution Check

*GATE: Must pass before implementation.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Test-First Development | PASS | Existing tests remain in place; visual changes don't require new unit tests for CSS |
| II. Simplicity & YAGNI | PASS | No new dependencies; restyling existing components only |
| III. Design Quality | PASS | This feature IS the design quality improvement; WCAG AA maintained |
| Technology Constraints | PASS | No new frameworks; staying within Node/TypeScript/Tailwind stack |
| Development Workflow | PASS | Feature branch off main; atomic commits |

**Complexity Tracking**: No violations. No new abstractions introduced.

## Project Structure

### Documentation (this feature)

```text
specs/009-stitch-ui-styling/
├── plan.md              # This file
├── research.md          # Phase 0 output — design decisions from mockup analysis
├── checklists/
│   └── requirements.md  # Spec quality validation
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── globals.css                    # UPDATE — add @theme block + utility CSS
│   ├── layout.tsx                     # UPDATE — add Google Fonts links
│   ├── page.tsx                       # UPDATE — home page styling
│   ├── apply/page.tsx                 # UPDATE — 2-col layout + trust sidebar
│   ├── customers/page.tsx             # VERIFY — already styled
│   ├── customers/[id]/page.tsx        # VERIFY
│   ├── officer/page.tsx               # UPDATE — dashboard layout
│   ├── officer/[id]/page.tsx          # UPDATE — application detail
│   └── status/page.tsx               # UPDATE — status page styling
└── components/
    ├── app-shell.tsx                  # UPDATE — sidebar layout for officer; top-bar for borrower
    ├── customer-list.tsx              # UPDATE — remove borders, add status badges
    ├── application-list.tsx           # UPDATE — remove borders, restyle
    ├── application-detail.tsx         # UPDATE — 3-col layout, tertiary-fixed rate lock
    ├── loan-form.tsx                  # UPDATE — input styling, button hierarchy
    └── [all other components]         # UPDATE — remove border-gray-200, use surface tokens

tests/
└── unit/                             # VERIFY — all 155 tests must still pass
```

**Structure Decision**: Single-project Next.js app with App Router. No route groups introduced (keeps changes minimal). AppShell handles layout switching by pathname.

## Screen-by-Screen Mapping

### Screen 1: Intelligence Dashboard (`/officer/page.tsx`)
**Mockup**: `intelligence_dashboard/code.html`
- AppShell renders sidebar (280px navy `bg-primary`) + main content area
- Main: `bg-surface` page, KPI cards in `grid-cols-12` (8 cols) + Portfolio Risk card (4 cols)
- Activity feed: `space-y-4` only, no dividers
- All section groupings: `bg-surface-container-low rounded-xl` (no border)

### Screen 2: Customer Directory (`/customers/page.tsx`)
**Mockup**: `customer_directory/code.html`
- Remove `border border-gray-200` table wrapper → `bg-surface-container-lowest rounded-xl`
- Remove `divide-y divide-gray-200` → `space-y-0` with hover `bg-surface-container-low`
- Status badges: VIP=`bg-blue-100 text-blue-800`, needs-attention=`bg-amber-100 text-amber-800`, new=`bg-emerald-100 text-emerald-800`
- Table header: `bg-surface-container-high` (no border)

### Screen 3: Application Detail (`/officer/[id]/page.tsx`)
**Mockup**: `application_detail_atlas_metropolis/code.html`
- 3-column layout: left nav (section links, `border-l-2 border-primary` active), center content, right summary
- Interest Rate Lock alert: `bg-tertiary-fixed rounded-xl` (warm orange `#ffdcc1`)
- Required documents: `space-y-2` only, no `divide-y`
- Sections: `bg-surface-container-lowest rounded-xl` on `bg-surface-container-low`

### Screen 4: Apply Form (`/apply/page.tsx`)
**Mockup**: `guided_application_form/code.html`
- 12-col grid: 8 cols form, 4 cols Secure Verification sidebar
- Trust sidebar: `signature-gradient rounded-xl` with `text-on-primary` and `text-tertiary-fixed` icons
- Form inputs: `bg-surface-container-lowest rounded-lg` with `outline-none focus:ring-2 focus:ring-primary/40`
- Submit button: `signature-gradient rounded-xl text-on-primary`

## Technical Decisions (from research.md)

1. **Tailwind 4 tokens**: `@theme {}` block in globals.css — colors as `--color-*`, fonts as `--font-*`
2. **Full MD3 palette**: 40+ tokens from mockup HTML (exact hex values)
3. **Typography**: Manrope for headlines, Inter for body — loaded via Google Fonts links in layout.tsx
4. **Icons**: Material Symbols Outlined via Google Fonts link + `.material-symbols-outlined` CSS rule
5. **Layout**: AppShell redesigned to sidebar (officer routes) vs minimal header (borrower/apply)
6. **Utilities**: `.signature-gradient` and `.glass-effect` as plain CSS classes
7. **Radius scale**: `DEFAULT=0.25rem`, `lg=0.5rem`, `xl=0.75rem`, `full=9999px`
8. **Buttons**: Primary=signature-gradient, Secondary=ghost border, Tertiary=text-primary only
9. **No-border rule**: All `border border-gray-*` on containers → background color shifts
10. **Status badges**: Background-color-only pills, semantic color mapping per Decision 10
