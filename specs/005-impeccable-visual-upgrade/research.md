# Research: Impeccable Visual Upgrade

**Feature**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)
**Date**: 2026-03-25

## Research Tasks & Findings

### R1: Navigation Bar Accent Treatment

**Context**: The nav bar (app-shell.tsx) currently uses a plain `border-b
border-gray-200` with white background. The spec requires a subtle visual
accent that differentiates it from a plain toolbar.

**Decision**: Add a gradient accent line at the bottom of the nav using an
`::after` pseudo-element approach via Tailwind's `bg-gradient-to-r` on a
thin decorative element, plus a subtle `shadow-sm` for depth.

**Rationale**:
- A thin blue-600 → blue-400 gradient line at the bottom communicates brand
  without being heavy-handed
- Matches Stripe dashboard's subtle nav accent pattern
- In dark mode, the gradient shifts to blue-500 → blue-300 at reduced opacity
- Implemented as a `<div>` with `h-0.5 bg-gradient-to-r from-blue-600
  via-blue-500 to-blue-400` below the nav content
- Shadow adds depth: `shadow-sm` (light) / existing dark border sufficient

**Alternatives considered**:
- **Background gradient on entire nav**: Too heavy, conflicts with "restraint"
  design principle
- **CSS border-image gradient**: Not well supported by Tailwind utilities
  without custom CSS
- **Logo treatment only**: Insufficient visual impact per spec requirement

### R2: Card Hover Transitions & Depth Cues

**Context**: Home page cards currently have `hover:shadow-md
hover:border-gray-300` but no smooth transition. The spec requires smooth
transitions within 200ms with lift/glow/shadow effects.

**Decision**: Use Tailwind's `transition-all duration-200` combined with
hover transforms (`hover:-translate-y-0.5`) and enhanced shadow
(`hover:shadow-lg`) for a "lift" effect. Add a left border accent on hover.

**Rationale**:
- `transition-all duration-200` covers shadow, transform, and border changes
  in a single declaration
- `hover:-translate-y-0.5` (2px lift) creates subtle physical feedback
- `hover:shadow-lg` deepens the shadow for perceived depth
- A `hover:border-l-blue-500 border-l-2 border-l-transparent` creates a
  colored accent on hover without layout shift (border always present,
  just transparent by default)
- Touch devices: hover effects are enhancement-only; base card remains
  fully styled and interactive

**Alternatives considered**:
- **Glow effect (box-shadow with color)**: Too flashy for fintech aesthetic
- **Scale transform**: Causes layout reflow in grid; translate-y is smoother
- **Border-top accent**: Less distinctive than left accent

### R3: Form Input Focus Transitions

**Context**: Form inputs use `focus-visible:ring-2 focus-visible:ring-blue-600`
which is browser-instantaneous. The spec requires smooth focus transitions.

**Decision**: Replace abrupt `focus-visible:ring` with `transition-shadow
duration-150` and a `focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500`
approach. Use `focus:` instead of `focus-visible:` for inputs (where both
keyboard and mouse focus should show transitions).

**Rationale**:
- `transition-shadow duration-150` on the base class makes ring appearance
  smooth
- `ring-blue-500/40` (40% opacity) is softer than solid ring — modern fintech
  pattern
- Border color also transitions via `transition-colors` (already covered by
  `transition-all`)
- The base state includes `ring-0 ring-blue-500/0` so the transition has
  start and end values
- `focus-visible` retained on buttons (keyboard-only); `focus` on inputs
  (always visible)

**Alternatives considered**:
- **Custom CSS animation for ring**: Over-engineered for a simple fade-in
- **Outline-based transitions**: `outline` doesn't transition smoothly in
  all browsers
- **Border-only focus (no ring)**: Less visible, accessibility concern

### R4: Button States (Hover, Active, Pressed)

**Context**: Buttons currently have `hover:bg-blue-700` (abrupt) and no
active state. The spec requires three distinct states with smooth transitions.

**Decision**: Add `transition-all duration-150` for smooth color change,
plus `active:scale-[0.98]` and `active:shadow-none` for pressed feedback.
Enhance hover with `hover:shadow-md` for lift.

**Rationale**:
- `transition-all duration-150` covers background, shadow, and transform
- `active:scale-[0.98]` provides subtle tactile press (2% shrink)
- `active:shadow-none` removes shadow on press for "pushed in" feel
- Hover adds `hover:shadow-md` for perceived elevation before click
- These three states (rest → hover → active) map to physical interaction
  model users expect

**Alternatives considered**:
- **`active:translate-y-px`**: Less noticeable than scale, and harder to
  combine with hover translate
- **Color-only active state**: Doesn't feel "pressed" — needs physical cue
- **Full 3D button with gradients**: Too heavy for flat fintech aesthetic

### R5: Success/Error Animation Strategy

**Context**: Form submissions show success and error states instantly. The
spec requires entrance animations for both.

**Decision**: Define CSS `@keyframes` in `globals.css` for `fade-in-up` and
`shake` animations. Apply via utility classes `animate-fade-in-up` and
`animate-shake`.

**Rationale**:
- `@keyframes fade-in-up`: `from { opacity: 0; transform: translateY(8px) }
  to { opacity: 1; transform: translateY(0) }` — clean entrance for success
- `@keyframes shake`: horizontal oscillation — clear error signal
- Duration: 300ms for fade-in-up, 400ms for shake
- Applied as Tailwind `@utility` classes in globals.css so they work with
  Tailwind's class system
- `prefers-reduced-motion: reduce` overrides both to `animation: none`

**Alternatives considered**:
- **Framer Motion library**: Spec forbids new dependencies
- **CSS Transitions only (no keyframes)**: Can't do slide-up-from-hidden
  easily without keyframes since the element mounts fresh
- **Inline styles**: Not maintainable; Tailwind utilities preferred

### R6: Table Row Hover Transitions

**Context**: Tables currently have `hover:bg-gray-50 dark:hover:bg-gray-700/50`
but the change is instant. The spec requires smooth transitions within 150ms.

**Decision**: Add `transition-colors duration-150` to each `<tr>` element.

**Rationale**:
- `transition-colors duration-150` on `<tr>` makes the background change
  smooth
- Minimal change — only need to add the transition utility to existing
  hover classes
- Rapid mouse movement: CSS transitions handle interruption gracefully —
  the browser cancels and reverses mid-transition, no queueing artifacts
- No performance concern: `background-color` transitions are GPU-composited

**Alternatives considered**:
- **`transition-all`**: Unnecessary for rows; only color changes
- **JavaScript-based hover**: Over-engineered for CSS capability
- **Row highlight animation (pulse/glow)**: Too attention-grabbing for
  data tables

### R7: Badge Visual Depth Treatment

**Context**: Status badges are flat colored rectangles with `rounded-full`.
The spec requires subtle depth (shadow, border, or gradient).

**Decision**: Add `shadow-sm ring-1 ring-inset` with color-matched ring to
each badge. This creates subtle depth without changing the flat design
language significantly.

**Rationale**:
- `shadow-sm` adds minimal depth shadow
- `ring-1 ring-inset ring-<color>-200/50` adds a subtle inner border that
  creates definition without heavy borders
- In dark mode: `dark:ring-<color>-400/20` for appropriate contrast
- `rounded-full` retained — badges already have good shape
- Consistent treatment across all badge types (status + qualification)

**Alternatives considered**:
- **Gradient backgrounds**: Too flashy for data-dense tables; conflicts
  with design principle of restraint
- **Outer border instead of ring-inset**: Adds visual weight, makes badges
  feel heavier
- **Icon + badge**: Out of scope — purely visual refinement, not structural

### R8: `prefers-reduced-motion` Strategy

**Context**: All new animations and transitions must respect the
`prefers-reduced-motion` accessibility setting.

**Decision**: Add a global `@media (prefers-reduced-motion: reduce)` block
in `globals.css` that sets `transition-duration: 0.01ms !important` and
`animation-duration: 0.01ms !important` for all elements.

**Rationale**:
- A single global override is simpler and more maintainable than adding
  `motion-reduce:` to every individual class
- `0.01ms` instead of `0s` avoids browsers that skip zero-duration events
- This catches all transitions and animations added by any component
- Tailwind CSS 4 doesn't need special config for this — standard
  `@media` block in globals.css works

**Alternatives considered**:
- **Per-element `motion-reduce:` utilities**: Would require adding
  `motion-reduce:transition-none` to every element — verbose and error-prone
- **`animation: none` only**: Misses transitions (the majority of effects)
- **JavaScript-based detection**: Over-engineered; CSS handles this natively

### R9: Dark Mode Adaptation for New Effects

**Context**: All visual effects must work in both light and dark modes.

**Decision**: Use Tailwind's `dark:` variant for every new visual class.
Shadows use `dark:shadow-gray-900/30` for appropriate contrast. Gradients
shift color stops. Ring colors use darker/lighter variants.

**Rationale**:
- Existing pattern: every component already has `dark:` variants
- Nav accent gradient: `dark:from-blue-400 dark:via-blue-500 dark:to-blue-600`
- Card shadows in dark: `dark:shadow-gray-900/50` (deeper shadow for
  dark backgrounds)
- Badge rings: `dark:ring-<color>-400/20` instead of `<color>-200/50`
- No new CSS custom properties needed — Tailwind utilities cover all cases

**Alternatives considered**:
- **CSS custom properties for shadow colors**: Would reduce repetition but
  adds complexity; Tailwind inline approach is consistent with codebase
- **Separate dark mode stylesheet**: Completely incompatible with current
  Tailwind approach
