# Research: Stitch UI Styling

**Feature**: 009-stitch-ui-styling
**Date**: 2026-03-27

---

## Decision 1: Tailwind CSS 4.x Token Strategy

**Decision**: Use the `@theme` directive in `globals.css` to register the Architectural Curator color palette as CSS custom properties that Tailwind 4.x resolves at build time. Colors map to `--color-*` variables, fonts to `--font-*` variables.

**Rationale**: Tailwind CSS 4.2.2 uses `@theme` instead of `tailwind.config.js` for custom token injection. The `@import "tailwindcss"` directive already present in globals.css is the correct Tailwind 4 entry point. Adding an `@theme {}` block after the import injects custom tokens as CSS custom properties while making them available as Tailwind utility classes (e.g., `bg-primary`, `text-on-surface`).

**Alternatives considered**:
- `tailwind.config.js` extend.colors: Valid for Tailwind 3.x but deprecated in Tailwind 4. The project's `@tailwindcss/postcss` package confirms 4.x.
- Inline CSS custom properties in `:root`: Works but bypasses Tailwind's utility generation — utilities like `bg-primary` would not be available.

---

## Decision 2: Material Design Color Palette (Complete Token Set)

**Decision**: Use the exact color values from the Stitch HTML mockups' `tailwind.config` block verbatim. This is the authoritative source of truth.

**Token set** (from `guided_application_form/code.html` and `intelligence_dashboard/code.html` — both identical):
```
primary:                   #003464
primary-container:         #1a4b82
primary-fixed:             #d4e3ff
primary-fixed-dim:         #a5c8ff
inverse-primary:           #a5c8ff
on-primary:                #ffffff
on-primary-fixed:          #001c3a
on-primary-fixed-variant:  #15477e
on-primary-container:      #92bcfa
secondary:                 #4b6078
secondary-container:       #cce2fe
secondary-fixed:           #d0e4ff
secondary-fixed-dim:       #b3c8e4
on-secondary:              #ffffff
on-secondary-container:    #4f647d
on-secondary-fixed:        #041d32
on-secondary-fixed-variant: #33485f
tertiary:                  #502a00
tertiary-container:        #713d00
tertiary-fixed:            #ffdcc1
tertiary-fixed-dim:        #ffb779
on-tertiary:               #ffffff
on-tertiary-container:     #f4aa67
on-tertiary-fixed:         #2e1500
on-tertiary-fixed-variant: #6c3a00
surface:                   #f8f9fa
surface-dim:               #d9dadb
surface-bright:            #f8f9fa
surface-variant:           #e1e3e4
surface-container-lowest:  #ffffff
surface-container-low:     #f3f4f5
surface-container:         #edeeef
surface-container-high:    #e7e8e9
surface-container-highest: #e1e3e4
inverse-surface:           #2e3132
inverse-on-surface:        #f0f1f2
surface-tint:              #336098
on-surface:                #191c1d
on-surface-variant:        #424750
on-background:             #191c1d
background:                #f8f9fa
outline:                   #737781
outline-variant:           #c3c6d1
error:                     #ba1a1a
error-container:           #ffdad6
on-error:                  #ffffff
on-error-container:        #93000a
```

**Rationale**: Using the exact hex values from the mockups prevents any color drift. These are Material Design 3 baseline tokens for a blue/orange scheme.

**Alternatives considered**: Manually approximating colors from screenshots — rejected because the HTML source gives exact values.

---

## Decision 3: Typography Strategy

**Decision**: Load Manrope (weights 400, 600, 700, 800) and Inter (weights 400, 500, 600) via Google Fonts link tags in `src/app/layout.tsx`. Map them to `--font-headline` and `--font-body` via the `@theme` block. Add `font-headline` and `font-body` CSS variable utilities to globals.css.

**Rationale**: The Stitch mockups use:
```css
fontFamily: {
  "headline": ["Manrope"],
  "body": ["Inter"],
  "label": ["Inter"]
}
```
In Tailwind 4, custom font families are defined as `--font-headline` and `--font-body` in the `@theme` block, then used as `font-headline` and `font-body` utilities.

**Alternatives considered**: next/font/google: Preferred for production (no FOIT, local optimization), but requires import in layout.tsx and variable mapping. Using Google Fonts links is simpler and matches the mockup approach exactly.

---

## Decision 4: Material Symbols Outlined Icon Font

**Decision**: Load Material Symbols Outlined via a `<link>` tag in `layout.tsx` head:
```
https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap
```

And add the CSS rendering rule in `globals.css`:
```css
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
```

Icons are used as inline text: `<span className="material-symbols-outlined">icon_name</span>`

**Rationale**: This is exactly how the Stitch mockups load and use icons. The variable font supports weight and fill variations via `font-variation-settings`.

**Alternatives considered**: SVG icon libraries (lucide-react, heroicons): Would require new dependencies and different icon names than the Stitch mockups use. Rejected per constitution (no new dependencies unless justified).

---

## Decision 5: Layout Architecture

**Decision**: Redesign the app-shell to implement a sidebar layout for officer views and a top-bar-only layout for borrower views. Use a single `AppShell` that renders a navy sidebar (`bg-primary`) with navigation for officer routes and a minimal header for borrower/apply routes. Route detection via `usePathname()`.

**Current state**: `app-shell.tsx` renders a simple horizontal nav bar for all routes. The Stitch mockups show a 280px fixed-width vertical sidebar for officer views.

**Sidebar nav items** (from `intelligence_dashboard/code.html`):
- Logo: `account_balance` icon + "LoanPro" text
- Dashboard → `/officer` (icon: `dashboard`)
- Applications → `/officer` (icon: `description`)
- Customers → `/customers` (icon: `group`)
- Settings → `/settings` (icon: `settings`)
- Bottom: Help (icon: `contact_support`) + Logout (icon: `logout`)

**Rationale**: A single AppShell with conditional sidebar/header rendering avoids requiring Next.js route groups (which would require new layout files), staying close to the existing architecture.

**Alternatives considered**: Next.js route groups `(officer)` and `(borrower)` with separate layout.tsx files: Cleaner but requires deleting old route structure and creating new pages. Keeping AppShell is simpler and less disruptive.

---

## Decision 6: Signature Gradient and Glass Effect Utilities

**Decision**: Define as plain CSS classes in `globals.css` (not Tailwind utilities), exactly as the mockups do:
```css
.signature-gradient {
  background: linear-gradient(135deg, #003464 0%, #1a4b82 100%);
}
.glass-effect {
  backdrop-filter: blur(20px);
  background-color: rgba(248, 249, 250, 0.8);
}
```

Used directly as class names: `className="signature-gradient"`.

**Rationale**: These are multi-property utilities that don't map cleanly to a single Tailwind token. CSS classes are simpler and match the mockup approach.

---

## Decision 7: Border Radius Scale

**Decision**: The Stitch mockups use a specific border radius scale:
```
DEFAULT: 0.25rem (4px)
lg:      0.5rem  (8px)  — card corners
xl:      0.75rem (12px) — sidebar, prominent cards
full:    9999px          — badges, pills
```

In Tailwind 4, override the default radius scale via the `@theme` block:
```css
--radius: 0.25rem;
--radius-lg: 0.5rem;
--radius-xl: 0.75rem;
```

**Alternatives considered**: Using Tailwind defaults: The defaults (sm=2px, md=6px, lg=8px, xl=12px, 2xl=16px) are close but not exact. The mockups are explicit about the scale, so we override.

---

## Decision 8: Button Hierarchy

**Decision**: Three button tiers from the Stitch design system:
- **Primary**: `.signature-gradient` background + `rounded-xl` + `text-on-primary` (white) + `px-6 py-3`
- **Secondary**: No fill + `border border-outline-variant` ghost border + `text-on-secondary-fixed-variant` + `rounded-xl`
- **Tertiary**: No border, no fill + `text-primary font-semibold`

**Rationale**: Directly extracted from `proloan_fidelity/DESIGN.md` and confirmed in the mockup HTML.

---

## Decision 9: No-Border Section Rule Implementation

**Decision**: Replace all `border border-gray-200` / `border border-gray-700` on layout containers with background color shifts:
- Page background: `bg-surface` (`#f8f9fa`)
- Section groupings: `bg-surface-container-low` (`#f3f4f5`)
- Cards/interactive: `bg-surface-container-lowest` (`#ffffff`)
- Insets (search bars, toolbars): `bg-surface-container-high` (`#e7e8e9`)

List item separation: `gap-4` or `space-y-4` only — no `divide-y` or `border-b`.

**Rationale**: The "No-Line Rule" from DESIGN.md is the defining visual characteristic of the Architectural Curator. Removing borders is the single biggest visual change.

---

## Decision 10: Customer Status Badges

**Decision**: Status badge color mapping (background-only, rounded-full pill):
- **VIP**: `bg-blue-100 text-blue-800` → corresponds to `bg-secondary-fixed text-secondary`
- **Needs Attention**: `bg-amber-100 text-amber-800`
- **New**: `bg-emerald-100 text-emerald-800`
- **Standard**: `bg-surface-container-high text-on-surface-variant`

Badge structure: `<span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ...">Status</span>`

**Rationale**: Extracted from `customer_directory/code.html`. The warm amber for needs-attention provides semantic contrast against the primary blue without using error red (which is reserved for rejections).
