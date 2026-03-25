# Quickstart: Impeccable Design Polish

**Feature**: 003-impeccable-design-polish | **Date**: 2026-03-25

## Prerequisites

- Node.js 20+ LTS
- Existing LoanPro application running (`npm run dev`)
- Browser with dark mode toggle capability (macOS: System Settings > Appearance)

## Verification Scenarios

### 1. Dark Mode — System Preference Toggle

1. Start the dev server: `npm run dev`
2. Open `http://localhost:3000` in the browser
3. Set OS to **light mode** → verify all pages have white/light backgrounds, dark text
4. Set OS to **dark mode** → verify all pages switch to dark backgrounds, light text
5. Toggle back to light mode → verify immediate switch, no page reload needed

**Check on every page**: `/`, `/apply`, `/status`, `/officer`, `/officer/[id]`, `/customers`, `/customers/[id]`

### 2. Typography & Visual Hierarchy

1. Navigate to `/officer` (officer dashboard)
2. Verify: page title is largest text, table headers are distinct from cell content
3. Navigate to `/officer/[id]` (application detail)
4. Verify: applicant name and loan amount are the most visually prominent elements
5. Check currency values are right-aligned and consistently formatted (`$150,000`)
6. Check percentages are consistent (`28.5%`)

### 3. Semantic Badge Colors

1. On `/officer` page, verify badge colors:
   - "Qualified" badges: green background
   - "Not Qualified" badges: red background
   - "Pending" status: amber/yellow treatment
   - "N/A": neutral gray
2. Toggle dark mode → verify badges remain readable with adjusted dark-mode colors
3. Navigate to `/officer/[id]` → verify qualification summary uses same color scheme

### 4. Interactive Element States

1. Tab through the `/apply` page using keyboard only
2. Verify: every form field shows a visible focus ring when focused
3. Verify: all buttons show hover state change on mouse hover
4. Verify: navigation links show hover color change
5. Tab through `/status` lookup form — verify focus indicators

### 5. Loading & Empty States

1. Navigate to `/officer` → verify skeleton loaders appear briefly before data loads
2. Navigate to `/customers` → verify skeleton loaders (not "Loading..." text)
3. Verify no raw "Loading..." text appears anywhere in the app

### 6. Contrast Verification

1. In dark mode, inspect all text on every page
2. Verify: no text is difficult to read against its background
3. Pay special attention to: gray metadata text, badge text, form placeholder text
4. Use browser DevTools or accessibility checker to spot-check contrast ratios (target: 4.5:1 minimum)

## Quick Smoke Test

Run the existing test suite to confirm no functional regressions:

```bash
npm test
```

All 85 existing tests must pass. Then visually verify light/dark mode on `/`, `/apply`, `/officer`, and `/customers` pages.
