# Feature Specification: Navigation Fix & Role Switching

**Feature Branch**: `010-role-switching-nav`
**Created**: 2026-03-27
**Status**: Draft
**Input**: User description: "fix the navigation.  allow the app to be able to switch roles"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Switch from Borrower to Officer View (Priority: P1)

A user currently in the borrower-facing area of the app (home, apply, or status pages) wants to access the loan officer dashboard. They should be able to switch their active role without needing to manually type in a URL.

**Why this priority**: Without a role-switching mechanism, users are trapped in whichever view they happen to land on. This is the most fundamental gap — the app has two distinct workflows with no way to navigate between them.

**Independent Test**: Can be fully tested by loading the home or `/apply` page, using the role switcher UI, and verifying the officer sidebar and dashboard appear.

**Acceptance Scenarios**:

1. **Given** a user is on any borrower page (home, apply, status), **When** they select "Loan Officer" from the role switcher, **Then** they are navigated to the officer dashboard with the officer sidebar navigation visible.
2. **Given** a user switches to the officer role, **When** the page loads, **Then** the officer sidebar is fully rendered with all navigation links (Dashboard, Applications, Customers).
3. **Given** a user is already in the officer view, **When** they switch to the "Borrower" role, **Then** they are navigated to the borrower home page with the borrower header visible and sidebar hidden.

---

### User Story 2 - Persistent Role Selection Within a Session (Priority: P2)

A user who has switched to the officer role navigates between officer pages (e.g., from the dashboard to a specific application). The role selection should persist — the sidebar should remain visible and the officer context should not be lost.

**Why this priority**: Without persistence, switching roles would only work on a single page. Officers need to move between the dashboard, application detail, and customer pages without the UI reverting to borrower mode.

**Independent Test**: Can be tested by switching to officer role, navigating to Applications, then to Customers, and verifying the sidebar persists throughout.

**Acceptance Scenarios**:

1. **Given** a user has switched to the officer role, **When** they click "Applications" in the sidebar, **Then** the officer layout persists with the sidebar visible on the new page.
2. **Given** a user has switched to the officer role and navigated to a customer detail page, **When** they click the browser back button, **Then** they remain in officer mode with the sidebar intact.
3. **Given** a user refreshes the page while in officer mode, **Then** the officer role and layout are preserved.

---

### User Story 3 - Clear Role Identity Display (Priority: P3)

The current active role is clearly visible at all times so users know which mode they are operating in. The role switcher shows the current role and makes switching discoverable.

**Why this priority**: Without a clear indicator, users may be confused about which role they have active, especially in a multi-role demo/development environment.

**Independent Test**: Can be tested by inspecting the navigation in both officer and borrower views and verifying the active role label and switcher UI are visible.

**Acceptance Scenarios**:

1. **Given** a user is in the officer view, **When** they look at the navigation, **Then** a clear label or badge shows "Loan Officer" as the active role.
2. **Given** a user is in the borrower view, **When** they look at the navigation header, **Then** a role switcher control is visible and shows "Borrower" as the current role.
3. **Given** a user opens the role switcher, **Then** the available roles are displayed as clear, selectable options.

---

### Edge Cases

- What happens when a user directly navigates to `/officer` via the URL without having selected the officer role via the switcher? The officer layout and sidebar should render correctly (backward compatibility with current URL-based detection).
- What happens if a user is mid-way through filling out a loan application form and switches roles? The form state may be lost — the role switcher should be accessible but not disruptively interrupt the current page.
- What happens on mobile viewports where the full sidebar may not fit? The navigation should remain usable — a collapsed or menu-based variant is acceptable.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The app MUST provide a role-switching control accessible from both the borrower header and the officer sidebar navigation.
- **FR-002**: The role switcher MUST support at minimum two roles: "Borrower" and "Loan Officer".
- **FR-003**: Selecting a role MUST navigate the user to the appropriate default page for that role (officer → officer dashboard; borrower → home page).
- **FR-004**: The selected role MUST persist across page navigations within the same browser session so that moving between pages does not reset the role.
- **FR-005**: The currently active role MUST be visually indicated in the navigation at all times.
- **FR-006**: The officer sidebar navigation MUST correctly highlight the active page link based on the current route with no incorrect highlights.
- **FR-007**: The borrower header MUST display the role switcher in a discoverable, consistent location.
- **FR-008**: Direct URL navigation to officer routes MUST continue to render the officer layout and navigation, preserving backward compatibility.

### Key Entities

- **Active Role**: The currently selected user role ("Borrower" or "Loan Officer") held in browser session state. Determines which navigation layout is rendered throughout the session.
- **Role Switcher**: A UI control (dropdown, toggle, or button group) that displays the current role and allows switching to another available role.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can switch from borrower view to officer view in 2 interactions or fewer (open role switcher, select role).
- **SC-002**: The selected role persists across at least 5 consecutive page navigations within the same session without reverting.
- **SC-003**: 100% of officer sidebar navigation links correctly highlight only when that exact section is active — no false positives.
- **SC-004**: The active role label is visible without scrolling on all primary navigation layouts in both officer and borrower views.
- **SC-005**: The role switcher is reachable from every page in the app — no page requires a specific starting point to switch roles.

## Assumptions

- Role switching is a session-level convenience feature for a demo/development context — no server-side authentication or real authorization is required as part of this feature.
- The two roles to support are "Borrower" and "Loan Officer" — no additional roles (e.g., Admin) are in scope for this feature.
- The existing URL-based role detection in the app shell can be replaced or augmented with session state without breaking existing routes.
- Mobile responsiveness for the role switcher is in scope, but a full mobile sidebar redesign is not required — a simplified mobile nav is acceptable.
- Role state will persist for the duration of the browser session but will not carry over across browser sessions or tabs.
