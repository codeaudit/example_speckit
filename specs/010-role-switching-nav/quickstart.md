# Quickstart: Navigation Fix & Role Switching

**Branch**: `010-role-switching-nav`

## Running the App

```bash
npm run dev
# App available at http://localhost:3000
```

## Manual Verification Steps

1. **Open borrower view**: Navigate to `http://localhost:3000` — borrower header with role switcher visible
2. **Switch to officer**: Use role switcher (top-right of header) → select "Loan Officer" → officer sidebar appears, lands on `/officer`
3. **Verify persistence**: Navigate to Customers (`/customers`) → sidebar persists with "Customers" link highlighted
4. **Verify refresh**: Refresh page → officer layout preserved
5. **Switch back**: Use role switcher in sidebar → select "Borrower" → borrower header appears, lands on `/`
6. **Direct URL access**: Navigate directly to `http://localhost:3000/officer` — officer sidebar displays without switching roles
7. **Active link accuracy**: Verify only one sidebar link is highlighted at a time (Dashboard removed, Applications + Customers are distinct)

## Running Tests

```bash
npm test
```

New test file: `tests/unit/role-context.test.ts`

Covers:
- Default role is `null` when sessionStorage is empty
- `setRole("officer")` stores to sessionStorage and updates state
- `setRole("borrower")` stores to sessionStorage and updates state
- Role is restored from sessionStorage on initialisation
- Layout selection logic: officer layout when `role === "officer"` OR URL matches officer route
- Layout selection logic: borrower layout when `role === "borrower"` AND URL is not an officer route
- Switching from officer to borrower clears officer layout
