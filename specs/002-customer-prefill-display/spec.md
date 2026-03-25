# Feature Specification: Customer Prefill & Display

**Feature Branch**: `002-customer-prefill-display`
**Created**: 2026-03-25
**Status**: Draft
**Input**: User description: "I need to prefill customer info in the database and have the app display each customer."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Customer Directory (Priority: P1)

A user (loan officer or borrower) navigates to the customer
directory and sees a list of all customers in the system. Each
entry shows the customer's name, email, and any other summary
details. Clicking a customer reveals their full profile.

**Why this priority**: Displaying customers is the core value of
this feature. Without the ability to view customers, prefilling
data has no visible effect.

**Independent Test**: Can be fully tested by navigating to the
customer directory page and verifying that all prefilled customers
appear with correct information.

**Acceptance Scenarios**:

1. **Given** the system has prefilled customer data,
   **When** a user navigates to the customer directory,
   **Then** all customers are displayed in a list with name and
   email visible.
2. **Given** the customer directory is displayed,
   **When** a user clicks on a customer entry,
   **Then** the system shows the customer's full profile
   including all stored details.
3. **Given** no customers exist in the system,
   **When** a user navigates to the customer directory,
   **Then** the system displays a clear "No customers found"
   message.

---

### User Story 2 - Prefill Customer Data on Application Start (Priority: P2)

When the application starts for the first time (empty database),
the system automatically seeds the customer table with a set of
predefined customer records. These customers are available
immediately for viewing and for use in loan applications.

**Why this priority**: Seeding ensures the system has usable data
out of the box for demonstration, testing, and initial use without
requiring manual data entry.

**Independent Test**: Can be tested by starting the application
with a fresh database and verifying the customer records appear
without any manual input.

**Acceptance Scenarios**:

1. **Given** the application starts with an empty database,
   **When** the database initializes,
   **Then** a predefined set of customer records is
   automatically inserted.
2. **Given** the database already contains customer data,
   **When** the application restarts,
   **Then** the system does NOT duplicate or overwrite existing
   customer records.
3. **Given** prefilled customers exist,
   **When** a user views the customer directory,
   **Then** each prefilled customer has complete and realistic
   data (name, email, phone, address).

---

### User Story 3 - Autofill Loan Application from Customer (Priority: P3)

When a borrower starts a new loan application, they can select
an existing customer from the prefilled directory to auto-populate
the applicant name and email fields, reducing data entry and
errors.

**Why this priority**: This enhances the loan application flow
by leveraging prefilled customer data, but the core
submit-and-review workflow already works without it.

**Independent Test**: Can be tested by starting a new loan
application, selecting a prefilled customer, and verifying the
form fields populate with the customer's name and email.

**Acceptance Scenarios**:

1. **Given** the borrower is on the loan application form,
   **When** they choose to select an existing customer,
   **Then** a searchable list of customers is presented.
2. **Given** the customer selection list is shown,
   **When** the borrower selects a customer,
   **Then** the applicant name and email fields are
   auto-populated with that customer's data.
3. **Given** a customer has been selected,
   **When** the borrower edits the auto-populated fields,
   **Then** the changes are accepted (auto-populated values are
   not locked).

---

### Edge Cases

- What happens if the seed data migration fails partway through?
  The system MUST complete the migration atomically — either all
  seed records are inserted or none are.
- What happens if a prefilled customer's email conflicts with
  another record? Each customer MUST have a unique email address
  in the seed data.
- What happens when the customer list is very large? The directory
  MUST handle displaying up to 100 customers without performance
  degradation.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST store customer records with: full name,
  email address, phone number, and mailing address (street, city,
  state, zip code).
- **FR-002**: System MUST automatically insert a predefined set
  of at least 10 sample customers when the database is first
  initialized (seed data).
- **FR-003**: System MUST NOT re-insert seed data if customer
  records already exist in the database.
- **FR-004**: System MUST provide a customer directory page that
  lists all customers with name and email visible.
- **FR-005**: System MUST allow users to view a customer's full
  profile (all stored fields) from the directory.
- **FR-006**: System MUST provide a way to select an existing
  customer when filling out a loan application, auto-populating
  the applicant name and email fields.
- **FR-007**: System MUST allow the borrower to override
  auto-populated fields after selecting a customer.
- **FR-008**: System MUST display a clear message when the
  customer directory is empty.

### Key Entities

- **Customer**: Represents a person in the system who may apply
  for loans. Key attributes: full name, email address (unique),
  phone number, mailing address (street, city, state, zip code).
  Relationship: a customer may be linked to one or more loan
  applications via their name and email.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On first launch with a fresh database, at least 10
  customer records are available in the directory within 2 seconds
  of page load.
- **SC-002**: A user can find and view any customer's full profile
  in under 3 clicks from the home page.
- **SC-003**: Selecting a customer to autofill a loan application
  takes under 5 seconds from form load to populated fields.
- **SC-004**: 100% of seed data records contain complete, valid
  information across all required fields.

## Assumptions

- Customer data is for demonstration and local use; no real
  personal data is used in seed records.
- The customer entity is independent from loan applications — a
  customer record existing does not mean a loan application exists.
- Customer management (add, edit, delete) is out of scope for
  this feature; customers are read-only in v1 (prefilled via seed
  data only).
- The existing loan application form (from feature 001) will be
  enhanced to support customer selection, not replaced.
- Phone number and address fields are display-only for the
  customer profile and are not used in the loan qualification
  engine.
