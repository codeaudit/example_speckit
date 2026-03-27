# Feature Specification: Officer Kanban Board

**Feature Branch**: `007-officer-kanban-board`
**Created**: 2026-03-26
**Status**: Draft
**Input**: User description: "I want a kanban feature for this loan application for the loan reviewer"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Applications as Kanban Columns (Priority: P1)

As a loan officer, I want to see all loan applications organized in columns by their status (Pending, Approved, Rejected) so I can instantly understand my pipeline at a glance without scrolling through a flat list.

**Why this priority**: This is the core value of the kanban view — visual pipeline management. Without columns, there is no kanban. This replaces the current list-based officer view with a spatial, status-grouped layout that communicates workload distribution immediately.

**Independent Test**: Can be fully tested by navigating to the officer kanban view and verifying applications appear in the correct status columns. Delivers immediate visual pipeline awareness.

**Acceptance Scenarios**:

1. **Given** there are applications in various statuses, **When** the officer opens the kanban view, **Then** applications are displayed in three columns: Pending, Approved, and Rejected, with each application shown in its correct column.
2. **Given** a new application is submitted by a borrower, **When** the officer refreshes the kanban view, **Then** the new application appears in the Pending column.
3. **Given** there are no applications in a particular status, **When** the officer views the kanban board, **Then** that column displays an empty state message (e.g., "No applications") rather than disappearing.

---

### User Story 2 - Application Card Summary (Priority: P1)

As a loan officer, I want each kanban card to show key application details (applicant name, loan amount, qualification status, and submission date) so I can triage applications without opening each one individually.

**Why this priority**: Cards with meaningful summary data are essential for the kanban to be useful — without them, the officer still needs to click into every application. This is co-priority with Story 1 because columns without informative cards have no value.

**Independent Test**: Can be tested by viewing any application card on the kanban board and verifying it displays the applicant name, loan amount, qualification badge, and date.

**Acceptance Scenarios**:

1. **Given** an application exists, **When** displayed as a kanban card, **Then** the card shows: applicant name, loan amount (formatted as currency), qualification status (Qualified/Not Qualified badge), and submission date.
2. **Given** an application card is displayed, **When** the officer clicks on it, **Then** the officer is navigated to the existing application detail page for that application.

---

### User Story 3 - Drag-and-Drop Application Between Columns (Priority: P2)

As a loan officer, I want to drag an application card from the Pending column to the Approved or Rejected column to quickly make a decision, so I can process applications faster with a natural, visual interaction.

**Why this priority**: Drag-and-drop is the defining interaction pattern of a kanban board. It transforms the decision workflow from navigating into each application detail to a single gesture, significantly reducing time-per-decision for straightforward cases.

**Independent Test**: Can be tested by dragging an application card from Pending to Approved and verifying the application status is updated and the card moves to the new column.

**Acceptance Scenarios**:

1. **Given** a Pending application, **When** the officer drags its card to the Approved column, **Then** the system prompts for an optional decision note and updates the application status to Approved.
2. **Given** a Pending application, **When** the officer drags its card to the Rejected column, **Then** the system prompts for an optional decision note and updates the application status to Rejected.
3. **Given** an already-decided application (Approved or Rejected), **When** the officer attempts to drag it to another column, **Then** the drag is prevented and no status change occurs (decisions are final).
4. **Given** the officer drags a card but drops it back in the same column, **When** the drop completes, **Then** no status change occurs.

---

### User Story 4 - Column Counts (Priority: P3)

As a loan officer, I want to see the count of applications in each column header so I can understand my workload without manually counting cards.

**Why this priority**: Nice-to-have that improves usability but is not essential for core kanban functionality. The officer can visually estimate counts from the cards themselves.

**Independent Test**: Can be tested by verifying each column header displays a count that matches the number of cards in that column.

**Acceptance Scenarios**:

1. **Given** applications exist in various statuses, **When** the kanban board loads, **Then** each column header shows the count of applications in that status (e.g., "Pending (12)").
2. **Given** an application moves between columns (via drag-and-drop), **When** the move completes, **Then** both the source and destination column counts update immediately.

---

### Edge Cases

- What happens when there are many applications (50+) in a single column? Cards should be scrollable within the column without affecting the overall page layout.
- What happens if two officers process the same application simultaneously? The system should reflect the most recent status on refresh; the kanban view does not need real-time sync.
- What happens on narrow screens where three columns don't fit? The kanban board should allow horizontal scrolling to access all columns.
- What happens if a drag-and-drop action fails (e.g., network error)? The card should return to its original column and the officer should see an error message.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display loan applications in a kanban-style board with three columns: Pending, Approved, and Rejected.
- **FR-002**: System MUST show each application as a card containing: applicant name, loan amount (formatted as currency), qualification status badge, and submission date.
- **FR-003**: System MUST allow officers to drag application cards from the Pending column to either the Approved or Rejected column to record a decision.
- **FR-004**: System MUST prompt the officer for an optional decision note when a card is dropped into a new status column, before committing the status change.
- **FR-005**: System MUST prevent dragging of already-decided applications (Approved or Rejected) to other columns.
- **FR-006**: System MUST display the count of applications in each column header.
- **FR-007**: System MUST allow officers to click on any application card to navigate to the existing application detail view.
- **FR-008**: System MUST display an empty state message when a column has no applications.
- **FR-009**: System MUST allow vertical scrolling within individual columns when the number of cards exceeds the visible area.
- **FR-010**: System MUST be accessible as a new view within the existing officer section of the application.

### Key Entities

- **Kanban Column**: A visual grouping representing one application status (Pending, Approved, Rejected). Contains zero or more application cards. Columns are fixed — officers cannot add, remove, or rename them.
- **Application Card**: A compact visual representation of a loan application displayed within a kanban column. Derived from the existing application data — no new data entity is created.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Officers can identify the status distribution of all applications within 3 seconds of opening the kanban view.
- **SC-002**: Officers can move a Pending application to Approved or Rejected in under 5 seconds using drag-and-drop.
- **SC-003**: 100% of application cards display accurate, current status reflecting the underlying data.
- **SC-004**: All three columns are visible and functional regardless of how many applications exist in any single column.

## Assumptions

- The kanban board is an additional view for officers, not a replacement of the existing officer list/detail pages.
- Only the three existing application statuses (Pending, Approved, Rejected) are used as columns — no new statuses or custom columns are introduced.
- Real-time collaboration between multiple officers is not required; standard page refresh is sufficient to see updated statuses.
- The existing decision workflow will be used when an application is moved via drag-and-drop — no new decision mechanism is needed.
- The kanban board is part of the officer section and is not visible to borrowers.
