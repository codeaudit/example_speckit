# Quickstart: Enhanced Officer Workflow

**Feature**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)
**Date**: 2026-03-25

## Prerequisites

- Node.js 20+ LTS
- `npm install` completed
- `npm run dev` running at http://localhost:3000
- Database seeded (automatic on first run)

## Verification Scenarios

### Scenario 1: Officer Customer List (US1)

1. Navigate to http://localhost:3000/officer
2. **Verify**: Page shows a list of customers (not applications)
3. **Verify**: Each customer row shows name, email, and application count
4. **Verify**: Customers are sorted alphabetically by name
5. **Verify**: Page renders correctly in both light and dark modes

### Scenario 2: Officer Customer Detail with Loans (US1)

1. From the officer page, click on a customer name (e.g., "John Carter")
2. **Verify**: URL changes to `/officer/customer/[id]`
3. **Verify**: Customer profile displays (name, email, phone, address)
4. **Verify**: Loan applications table shows all applications for that customer
5. **Verify**: Each application shows reference number, loan amount, transaction type, qualification status, and application status
6. **Verify**: Status badges use semantic colors (green/red/amber)
7. **Verify**: Pending applications have a "Review" link
8. **Verify**: A customer with no applications shows "No loan applications for this customer"

### Scenario 3: Officer Application Review from Customer Context (US1)

1. From the customer detail page, click "Review" on a pending application
2. **Verify**: URL changes to `/officer/[appId]`
3. **Verify**: Full application detail displays (applicant info, loan details, qualification summary)
4. **Verify**: Decision form is available (approve/reject with notes)
5. Submit a decision (approve or reject)
6. **Verify**: Redirected back to the customer detail page
7. **Verify**: The application's status has updated (no longer shows "Pending")

### Scenario 4: Customer Directory with Loan Information (US2)

1. Navigate to http://localhost:3000/customers
2. Click on any customer name
3. **Verify**: Customer profile displays as before
4. **Verify**: New "Loan Applications" section appears below the profile
5. **Verify**: Applications are listed with reference number, amount, type, qualification status, and application status
6. **Verify**: A customer with no matching applications shows "No loan applications found."
7. **Verify**: No "Review" links appear (review is officer-only)

### Scenario 5: Theme Toggle (US3)

1. Navigate to any page (e.g., http://localhost:3000)
2. **Verify**: A theme toggle button is visible in the navigation bar
3. **Verify**: Button shows appropriate icon (sun in dark mode, moon in light mode)
4. Click the toggle button
5. **Verify**: Theme switches immediately (< 100ms, no flash or layout shift)
6. **Verify**: All elements update correctly (backgrounds, text, borders, badges)
7. Navigate to a different page (e.g., /customers)
8. **Verify**: The manually selected theme persists across navigation
9. Hard-reload the page (Ctrl+Shift+R or Cmd+Shift+R)
10. **Verify**: Theme resets to system preference (session-only persistence)

### Scenario 6: Theme Toggle with System Preference (US3)

1. Start with no manual theme selection (fresh page load)
2. **Verify**: Theme matches OS preference
3. Change OS theme preference (System Settings → Appearance)
4. **Verify**: App theme updates to match new OS preference
5. Click the theme toggle to manually override
6. Change OS theme preference again
7. **Verify**: App stays on the manually selected theme (override active)

### Scenario 7: Edge Cases

1. **Rapid toggle**: Click the theme toggle rapidly 10+ times
   - **Verify**: No visual glitches, final state is consistent
2. **Empty customer**: Find or create a customer with no matching applications
   - **Verify**: Both officer and customer directory views show appropriate empty message
3. **Multiple applications**: View a customer with 2+ applications
   - **Verify**: All applications are listed with correct individual statuses
4. **Already-decided application**: View a customer with an approved/rejected application
   - **Verify**: No "Review" link appears for non-pending applications

## Test Verification

```bash
# Run full test suite — all existing 85 tests must pass
npm test

# Run only new tests
npm test -- --grep "customer-applications"
npm test -- --grep "theme-toggle"

# Production build
npm run build
```
