# Research: FannieMae UI Branding

**Feature**: 006-fanniemae-branding
**Date**: 2026-03-26

## R1: FannieMae Brand Color Palette

**Decision**: Adopt FannieMae's corporate color palette extracted from fanniemae.com.

**Rationale**: Direct extraction from the live website ensures brand fidelity. Colors verified against WCAG 2.1 AA contrast requirements.

**Brand Palette**:

| Token | Hex | Usage |
|-------|-----|-------|
| `brand-primary` | `#23517C` | Headings, nav links, primary brand identity |
| `brand-interactive` | `#0C77BA` | Link/button hover states, clickable elements |
| `brand-interactive-alt` | `#1C6FA3` | Secondary interactive (visited/active states) |
| `text-primary` | `#121212` | Body text |
| `text-muted` | `#717171` | Secondary text, placeholders, captions |
| `bg-page` | `#FFFFFF` | Main page background |
| `bg-section` | `#F3F5F9` | Alternating section backgrounds, card backgrounds |
| `bg-input` | `#F1F1EF` | Form input backgrounds |
| `border-default` | `#CAC8C3` | Card borders, dividers |
| `border-alt` | `#7E8C9A` | Secondary borders, table headers |
| `status-approved` | `#16a34a` (green-600) | Approved/qualified indicators |
| `status-rejected` | `#dc2626` (red-600) | Rejected/not-qualified indicators |
| `status-pending` | `#d97706` (amber-600) | Pending/warning indicators |

**Alternatives considered**:
- Using Tailwind's default blue-700 as closest match: rejected because #23517C has a distinct dark corporate blue tone that blue-700 (#1d4ed8) does not match.
- Extracting colors from FannieMae's annual report PDF: unnecessary — website colors are the canonical digital brand.

## R2: Typography — Source Sans Pro

**Decision**: Use Source Sans Pro via `next/font/google` (built into Next.js).

**Rationale**: Source Sans Pro is FannieMae's primary web font. `next/font` provides automatic optimization (self-hosting, no external requests, font-display swap). No new npm dependency required.

**Configuration**:
- Weights: 400 (regular body text), 700 (bold headings)
- Subsets: `latin`
- Display: `swap` (prevents invisible text during load)
- Fallback stack: `'Source Sans Pro', ui-sans-serif, system-ui, -apple-system, sans-serif`

**Alternatives considered**:
- Google Fonts CDN `<link>` tag: rejected because `next/font` is superior (self-hosted, no CORS, no layout shift).
- Source Sans 3 (variable font successor): considered but FannieMae's site uses the original Source Sans Pro, so matching exactly.

## R3: Dark Mode Removal Strategy

**Decision**: Remove dark mode entirely — delete ThemeProvider, theme-toggle component, and all `dark:` class prefixes.

**Rationale**: FannieMae's website is light-only. Clarification session confirmed: drop dark mode to match institutional aesthetic. Removing it simplifies the codebase (eliminates ThemeProvider context wrapper, toggle component, and ~200+ dark: class annotations).

**Removal scope**:
1. Delete `src/lib/theme-context.tsx`
2. Delete `src/components/theme-toggle.tsx`
3. Remove ThemeProvider wrapper from `app-shell.tsx`
4. Remove `@variant dark` directive from `globals.css`
5. Strip all `dark:*` class prefixes from all 13 components + pages
6. Remove `.dark` class logic from layout

**Alternatives considered**:
- Keep dark mode code but hide toggle: rejected — dead code violates Simplicity/YAGNI principle.
- Preserve for future: rejected — can be re-added if needed; keeping unused code adds maintenance burden.

## R4: Header Brand Identity Implementation

**Decision**: Replace "LoanPro" text with "LoanPro by Fannie Mae" using styled text (no logo image).

**Rationale**: Clarification session chose Option C (combined identity). Text-based avoids licensed asset requirements. "LoanPro" in brand-primary bold, "by Fannie Mae" in smaller muted weight.

**Visual treatment**:
- "LoanPro" — `text-lg font-bold` in `brand-primary` (#23517C)
- "by Fannie Mae" — `text-sm font-normal` in `text-muted` (#717171), positioned after "LoanPro"
- Both use Source Sans Pro

**Alternatives considered**:
- SVG logo asset: rejected — no licensed FannieMae logo available; text-based is the spec assumption.
- "Fannie Mae" only (drop LoanPro): rejected in clarification Q2.

## R5: Tailwind CSS v4 Theming Approach

**Decision**: Define brand tokens as CSS custom properties using Tailwind v4's `@theme` directive in `globals.css`.

**Rationale**: Tailwind CSS v4 uses CSS-first configuration. The `@theme` directive in `globals.css` is the canonical way to extend the default theme without a separate config file. This centralizes all brand values in one location (SC-006).

**Token definition pattern**:
```css
@theme {
  --color-brand-primary: #23517C;
  --color-brand-interactive: #0C77BA;
  --color-text-primary: #121212;
  --color-text-muted: #717171;
  --color-bg-page: #FFFFFF;
  --color-bg-section: #F3F5F9;
  --color-bg-input: #F1F1EF;
  --color-border-default: #CAC8C3;
  --color-border-alt: #7E8C9A;
  --font-family-sans: 'Source Sans Pro', ui-sans-serif, system-ui, sans-serif;
}
```

Components then use `bg-brand-primary`, `text-brand-interactive`, etc.

**Alternatives considered**:
- `tailwind.config.ts` file: rejected — Tailwind v4 prefers CSS-first config; adding a JS config is legacy.
- CSS variables without `@theme`: rejected — wouldn't integrate with Tailwind utility classes.
- Hardcoded hex values in components: rejected — violates SC-006 (single canonical location).

## R6: Accent Bar Replacement

**Decision**: Replace the current gradient accent bar with a flat solid bar using `brand-primary`.

**Rationale**: FR-006 requires flat design — no gradients. The current `bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400` violates this. A solid `brand-primary` (#23517C) bar is consistent with FannieMae's flat aesthetic.

**Alternatives considered**:
- Remove accent bar entirely: possible, but the bar provides useful visual separation between nav and content.
- Two-tone bar (brand-primary + brand-interactive): over-designed for the institutional aesthetic.
