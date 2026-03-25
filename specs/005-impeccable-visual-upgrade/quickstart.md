# Quickstart: Impeccable Visual Upgrade

**Feature**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)
**Prerequisites**: `npm run dev` running at `http://localhost:3000`

## Verification Scenarios

### Scenario 1: Navigation Bar Accent (US1)

1. Navigate to `http://localhost:3000`
2. **Verify**: Navigation bar has a thin gradient accent line (blue) at the
   bottom, distinguishing it from a plain toolbar
3. **Verify**: The nav feels elevated — subtle shadow or depth treatment
4. Switch to dark mode (click theme toggle)
5. **Verify**: Accent line adapts to dark mode (lighter gradient, proper contrast)
6. **Verify**: No broken contrast or missing elements

### Scenario 2: Home Page Hero & Cards (US1)

1. Navigate to `http://localhost:3000`
2. **Verify**: The headline "Welcome to LoanPro" and subheading have clear
   typographic hierarchy with visual weight and spacing
3. **Verify**: Action cards have a polished resting state (subtle shadow, clean borders)
4. Hover over each card slowly
5. **Verify**: Cards exhibit smooth lift effect (translate up, deeper shadow)
   within 200ms — no abrupt changes
6. **Verify**: A colored accent appears on hover (left border or similar)
7. Move mouse rapidly across all cards
8. **Verify**: Transitions are smooth, no visual artifacts or queuing
9. Resize to mobile (below 640px)
10. **Verify**: Cards stack vertically, all visual refinements intact
11. Switch to dark mode
12. **Verify**: Card hover effects, shadows, and accents work correctly in dark

### Scenario 3: Form Focus & Button States (US2)

1. Navigate to `http://localhost:3000/apply`
2. Click into the "Full Name" input field
3. **Verify**: Focus ring appears with a smooth transition (not abrupt)
4. **Verify**: Border color shifts subtly on focus
5. Tab through all form fields
6. **Verify**: Each field has smooth focus transition
7. Hover over the "Submit Application" button
8. **Verify**: Button shows smooth color/shadow transition on hover
9. Click and hold the submit button
10. **Verify**: Button shows pressed effect (slight scale down, shadow reduction)
11. Switch to dark mode and repeat steps 2-10
12. **Verify**: All transitions and effects work identically in dark mode

### Scenario 4: Form Submission Feedback (US2)

1. Navigate to `http://localhost:3000/apply`
2. Fill in valid loan application data and submit
3. **Verify**: Success confirmation appears with a visible animation
   (fade-in, slide-up, or scale-in) — not an abrupt render
4. Navigate to `http://localhost:3000/apply`
5. Submit the form with invalid data (leave required fields empty)
6. **Verify**: Error messages appear with smooth entrance animation
7. **Verify**: Affected field borders transition to error color
8. Navigate to `http://localhost:3000/status`
9. Search for a valid reference number
10. **Verify**: Result card appears with entrance animation
11. Search for an invalid reference number
12. **Verify**: "Not found" message appears with smooth entrance

### Scenario 5: Table Row Hover (US3)

1. Navigate to `http://localhost:3000/officer`
2. **Verify**: Customer list table is displayed
3. Hover over a table row
4. **Verify**: Row highlights with smooth transition (not abrupt), within 150ms
5. Move mouse rapidly across rows
6. **Verify**: Transitions are smooth, no artifacts
7. Navigate to `http://localhost:3000/customers`
8. Repeat hover tests on customer directory table
9. Click a customer → verify application table rows also have smooth hover
10. Switch to dark mode and repeat all table hover tests
11. **Verify**: Transitions work correctly in dark mode

### Scenario 6: Badge Visual Refinement (US3)

1. Navigate to `http://localhost:3000/officer`
2. Click on a customer with applications
3. **Verify**: Status badges (Pending, Approved, Rejected) have subtle depth
   — shadow, ring, or border treatment beyond flat colored rectangles
4. **Verify**: Qualification badges (Qualified, Not Qualified, N/A) have
   consistent design language with status badges
5. **Verify**: "Not Qualified" text does not overflow or break the badge layout
6. Check badge rendering across pages:
   - Status lookup result page
   - Application detail page (officer review)
   - Customer applications table
7. Switch to dark mode
8. **Verify**: All badge depth treatments render correctly with dark-mode colors

### Scenario 7: Accessibility & Edge Cases

1. **Reduced Motion**: Enable `prefers-reduced-motion: reduce` in browser
   dev tools or OS settings
2. Navigate through all pages
3. **Verify**: All animations and transitions are instant or near-instant
4. **Verify**: No visual information is lost — states still change, just without motion
5. **Wide Screen**: Resize browser to >1600px width
6. **Verify**: Layout remains centered and balanced (max-w-5xl constraint)
7. **Touch Device**: Open on a mobile device or use touch simulation
8. **Verify**: All interactive elements work without hover — hover is
   enhancement only
9. **Contrast Check**: Inspect accent colors, badge colors, and text against
   backgrounds
10. **Verify**: WCAG 2.1 AA contrast ratios maintained in both modes
