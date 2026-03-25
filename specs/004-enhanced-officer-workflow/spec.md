# Feature Specification: Enhanced Officer Workflow

**Feature Branch**: `004-enhanced-officer-workflow`
**Created**: 2026-03-25
**Status**: Draft
**Input**: User description: "should have a toggle button to flip between dark and light mode. The customer information should also include loan information. The officer review should be allowed to select each customer, see their loan status and then apply a review."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Officer Customer-Centric Review (Priority: P1)

A loan officer navigates to the officer review area and sees a list of
all customers (not just pending applications). The officer selects a
customer and sees a consolidated view showing the customer's profile
alongside all of their loan applications and each application's
current status (Pending, Approved, Rejected) and qualification
result. From this view, the officer can select any pending application
and apply a decision (approve or reject) without navigating away from
the customer context.

**Why this priority**: This is the core workflow improvement. Currently,
officers review applications in isolation without customer context.
Linking applications to customers gives officers the full picture they
need for decision-making — seeing all of a customer's loans, history,
and profile in one place.

**Independent Test**: Navigate to the officer area → see a list of
customers → click a customer → see their profile and all associated
loan applications with statuses → click a pending application →
approve or reject it → see the updated status reflected immediately.

**Acceptance Scenarios**:

1. **Given** the officer navigates to the officer review area,
   **When** the page loads,
   **Then** a list of all customers is displayed showing name, email,
   and count of their loan applications.
2. **Given** the officer clicks on a customer in the list,
   **When** the customer detail view opens,
   **Then** the customer's profile (name, email, phone, address) is
   displayed alongside a table of all their loan applications showing
   reference number, loan amount, transaction type, qualification
   status, and application status.
3. **Given** a customer has a pending application,
   **When** the officer clicks "Review" on that application,
   **Then** the full application detail (financial info, loan details,
   qualification summary) and decision form are displayed.
4. **Given** the officer approves or rejects an application,
   **When** the decision is submitted,
   **Then** the application status updates immediately and the officer
   returns to the customer view with the updated status visible.
5. **Given** a customer has no loan applications,
   **When** the officer views that customer,
   **Then** a message indicates "No loan applications for this customer"
   alongside the customer profile.

---

### User Story 2 - Customer Loan Information Display (Priority: P2)

When viewing any customer's profile (in the customer directory or
officer review), the system displays all loan applications associated
with that customer. This requires linking loan applications to
customers by matching the applicant email address. Each loan shows its
reference number, amount, type, qualification result, and current
status.

**Why this priority**: This enriches the existing customer data with
loan context. It supports the officer workflow (US1) but also benefits
the customer directory independently — anyone viewing a customer can
now see their loan history.

**Independent Test**: Navigate to the customer directory → click a
customer → see their profile plus a list of all associated loan
applications. Verify a customer with multiple applications shows all
of them. Verify a customer with no applications shows an appropriate
empty message.

**Acceptance Scenarios**:

1. **Given** a customer exists with one or more loan applications
   (matched by email),
   **When** the user views the customer detail page,
   **Then** a "Loan Applications" section appears below the customer
   profile showing all matching applications.
2. **Given** a customer has no matching loan applications,
   **When** the user views the customer detail page,
   **Then** the "Loan Applications" section shows
   "No loan applications found."
3. **Given** a customer has applications in multiple statuses
   (Pending, Approved, Rejected),
   **When** viewing the customer detail,
   **Then** each application displays its own status badge with the
   correct semantic color.
4. **Given** a loan application was submitted with an email matching
   a customer's email,
   **When** viewing that customer's profile,
   **Then** the application appears in their loan list regardless of
   when it was submitted.

---

### User Story 3 - Dark/Light Mode Toggle (Priority: P3)

A user (officer or borrower) sees a toggle button in the navigation
bar that allows them to manually switch between dark mode and light
mode. The system remembers the user's choice across page navigations
within the same session. If no manual choice has been made, the system
defaults to following the operating system preference (existing
behavior from feature 003).

**Why this priority**: The existing dark mode (feature 003) follows
system preference only. A manual toggle gives users direct control
and is a common UX expectation. It is lower priority because the
system already supports dark mode — this adds user override
capability.

**Independent Test**: Load the application → see toggle button in nav
→ click toggle → theme switches immediately → navigate to another page
→ theme persists → reload the page → theme resets to system preference
(session-only persistence).

**Acceptance Scenarios**:

1. **Given** the application is loaded with no prior manual choice,
   **When** the user views any page,
   **Then** the theme follows the operating system preference (light or
   dark).
2. **Given** the user clicks the theme toggle button,
   **When** the toggle activates,
   **Then** the theme immediately switches from the current mode to the
   opposite mode (light → dark or dark → light).
3. **Given** the user has manually selected a theme,
   **When** they navigate to a different page within the application,
   **Then** the manually selected theme persists.
4. **Given** the user has manually selected a theme,
   **When** they close and reopen the browser tab,
   **Then** the theme resets to the operating system preference
   (session-only, not persisted to storage).
5. **Given** the toggle button is displayed,
   **When** the user inspects the button,
   **Then** it visually indicates the current theme state (e.g., a sun
   icon for light mode, a moon icon for dark mode).

---

### Edge Cases

- What happens when a customer's email changes after they submitted
  a loan application? The system matches by the email at the time
  of application submission — historical applications remain linked
  to the original email. A customer whose email no longer matches any
  applications shows "No loan applications found."
- What happens when two customers share the same email address?
  The system links applications to all customers with that email.
  (In practice, seed data has unique emails so this is unlikely.)
- What happens when the theme toggle is clicked rapidly? The system
  MUST debounce or handle rapid toggling gracefully without visual
  glitches.
- What happens when the officer reviews an application and another
  officer has already decided it? The system MUST show the existing
  decision and prevent duplicate decisions (existing behavior).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The officer review area MUST display a list of all
  customers with their name, email, and the count of associated
  loan applications.
- **FR-002**: The officer MUST be able to select a customer and see
  their full profile alongside all of their loan applications.
- **FR-003**: Each loan application in the customer view MUST display
  reference number, loan amount, transaction type, qualification
  status (Qualified/Not Qualified/N/A), and application status
  (Pending/Approved/Rejected).
- **FR-004**: The officer MUST be able to select a pending application
  from the customer view and apply a review decision (approve/reject).
- **FR-005**: After a decision is submitted, the application status
  MUST update immediately in the customer view without a full page
  reload.
- **FR-006**: The customer detail page (in the customer directory)
  MUST display a "Loan Applications" section showing all loan
  applications associated with the customer's email address.
- **FR-007**: Loan applications MUST be matched to customers by
  comparing the applicant's email address to the customer's email.
- **FR-008**: The navigation bar MUST include a theme toggle button
  that switches between light and dark mode.
- **FR-009**: The theme toggle MUST immediately update the visual
  theme across all elements on the current page.
- **FR-010**: The manually selected theme MUST persist across page
  navigations within the same browser session.
- **FR-011**: When no manual theme selection has been made, the
  system MUST follow the operating system color preference (existing
  behavior).
- **FR-012**: The theme toggle button MUST visually indicate the
  current theme state (distinct icons or labels for light vs dark).
- **FR-013**: All new UI elements MUST support both light and dark
  modes with proper contrast and readability.

### Key Entities

- **Customer**: Existing entity (id, fullName, email, phone, address,
  createdAt). Now associated with loan applications via email matching.
- **Loan Application**: Existing entity (id, referenceNumber,
  applicantName, applicantEmail, loanAmount, transactionType, status,
  qualificationData, createdAt). Linked to Customer by email.
- **Decision**: Existing entity (id, applicationId, decisionType,
  decisionNote, isOverride, decidedAt). No structural changes.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A loan officer can select a customer and view all their
  loan applications within 2 seconds of clicking the customer name.
- **SC-002**: An officer can complete a review decision on a pending
  application without leaving the customer context (no more than 2
  clicks from customer selection to decision submission).
- **SC-003**: The theme toggle switches the visual mode in under 100
  milliseconds with no visible flash or layout shift.
- **SC-004**: All customer profiles correctly display their associated
  loan applications (zero mismatches when verified against the
  database).
- **SC-005**: After a decision is submitted, the updated status is
  visible in the customer view within 1 second without manual page
  refresh.
- **SC-006**: The existing 85 tests continue to pass after this
  feature is implemented (zero regressions).

## Assumptions

- Loan applications are linked to customers by email address match
  (applicantEmail = customer.email). No foreign key relationship
  exists in the database — matching is done at query time.
- The existing officer review page (`/officer`) will be restructured
  to show customers instead of a flat application list. The existing
  application detail and decision form components will be reused.
- The theme toggle stores state in-memory (session-only). No
  server-side persistence or cookie/localStorage is used for theme
  preference, keeping the implementation simple.
- The customer directory (`/customers`) will be enhanced to show
  loan applications — it will not gain decision-making capability
  (that is officer-only).
- All existing API routes remain unchanged. New API capabilities
  may be needed to query applications by customer email.
- The dark/light mode toggle builds on the existing dark mode
  implementation from feature 003 by adding a manual override.
