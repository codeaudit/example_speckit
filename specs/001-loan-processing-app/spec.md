# Feature Specification: Loan Processing Application

**Feature Branch**: `001-loan-processing-app`
**Created**: 2026-03-25
**Status**: Draft
**Input**: User description: "Create a simple loan processing application using node.js, impeccable, and a local data store (sqlite)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Submit a Loan Application (Priority: P1)

A borrower opens the application and fills out a loan request form
with their personal and financial details: name, email, annual
income, existing monthly debts, credit score, transaction type
(purchase or refinance), desired loan amount, loan term, interest
rate, and property value. For purchase transactions, the borrower
also enters the purchase price. Upon submission the system
validates the input, saves the application, calculates
qualification using hardcoded defaults for property taxes,
homeowners insurance, HOA fees, mortgage insurance, and reserve
requirements, and confirms receipt with a reference number.

**Why this priority**: Without the ability to submit a loan
application, no other feature has value. This is the core entry
point for all downstream processing.

**Independent Test**: Can be fully tested by completing and
submitting the loan form and verifying the confirmation screen
displays a reference number and the application appears in the
data store.

**Acceptance Scenarios**:

1. **Given** the borrower is on the loan application page,
   **When** they fill in all required fields with valid data and
   submit, **Then** the system saves the application and displays
   a confirmation with a unique reference number.
2. **Given** the borrower submits a form with missing or invalid
   fields, **When** they click submit, **Then** the system
   highlights the invalid fields with clear error messages and
   does not save the application.
3. **Given** the borrower selects "refinance" as the transaction
   type, **When** the form renders, **Then** the purchase price
   field is hidden and not required.
4. **Given** the borrower submits a valid application,
   **When** they note the reference number, **Then** they can
   later look up the application using that reference.

---

### User Story 2 - Review & Decide on Applications (Priority: P2)

A loan officer views a list of pending loan applications, opens
an individual application to review its details, sees the system's
auto-calculated qualification result (Qualified Yes/No with
computed ratios and any failed tests), and records a final approval
or rejection decision with an optional note. The qualification
engine is advisory — the officer makes the final call and may
override the system recommendation.

**Why this priority**: Applications have no business value until
they can be reviewed and decided upon. The advisory qualification
engine ensures consistent evaluation while preserving human
judgement for edge cases.

**Independent Test**: Can be tested by navigating to the
applications list, selecting an application, reviewing the
qualification summary, approving or rejecting it, and verifying
the status change and qualification data persist.

**Acceptance Scenarios**:

1. **Given** one or more applications exist with status "Pending",
   **When** the loan officer opens the applications list,
   **Then** all pending applications are displayed with key summary
   fields (applicant name, amount, date submitted, qualification
   result).
2. **Given** the loan officer is viewing a pending application,
   **When** the detail view loads, **Then** the system displays
   the auto-calculated qualification summary: GMI, PHE, TMD,
   Front-End %, DTI %, LTV %, Reserve Months, Credit Score,
   Qualified (Yes/No), and a list of any failed tests.
3. **Given** the loan officer is viewing a pending application,
   **When** they approve it with a note, **Then** the status
   changes to "Approved" and the decision note is saved — even if
   the system qualification result was "No" (officer override).
4. **Given** the loan officer is viewing a pending application,
   **When** they reject it with a note, **Then** the status
   changes to "Rejected" and the decision note is saved — even if
   the system qualification result was "Yes" (officer override).
5. **Given** an application has already been decided,
   **When** the loan officer views it, **Then** the decision,
   note, and qualification summary are displayed and the
   approve/reject actions are disabled.

---

### User Story 3 - View Application Status (Priority: P3)

A borrower looks up their application by reference number and
sees the current status (Pending, Approved, or Rejected) along
with any decision note left by the officer.

**Why this priority**: Provides borrower transparency into the
process. Depends on US1 (application exists) and benefits from
US2 (decisions recorded) but can be tested with any status.

**Independent Test**: Can be tested by entering a known reference
number and verifying the status page shows correct application
details and current status.

**Acceptance Scenarios**:

1. **Given** a valid reference number, **When** the borrower
   searches for their application, **Then** the system displays
   the application details and current status.
2. **Given** an invalid or non-existent reference number,
   **When** the borrower searches, **Then** the system displays
   a clear "not found" message.
3. **Given** an approved or rejected application, **When** the
   borrower views it, **Then** the decision note from the
   officer is visible.

---

### Edge Cases

- What happens when a borrower submits a duplicate application
  with the same details? The system accepts it as a separate
  application with its own reference number (duplicates are
  allowed; deduplication is out of scope for v1).
- What happens when the loan officer tries to decide on an
  application that was already decided? The system MUST prevent
  double-decisions and display the existing decision.
- What happens when the data store is unavailable? The system
  MUST display a user-friendly error and not lose submitted data
  that was already acknowledged.
- What happens when the borrower enters an extremely large loan
  amount? The system MUST enforce a maximum loan amount and
  reject values above it with a clear message.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow borrowers to submit a loan
  application with: full name, email address, annual income,
  existing monthly debts, credit score, transaction type
  (purchase or refinance), requested loan amount, desired loan
  term (in months), interest rate, and property value. For
  purchase transactions, purchase price is also required.
- **FR-002**: System MUST validate all application fields before
  saving — name and email must be non-empty, email must be a
  valid format, income must be a positive number, existing
  monthly debts must be zero or positive, credit score must be
  300–850, transaction type must be "purchase" or "refinance",
  loan amount must be between 1,000 and 500,000, term must be
  6–360 months, interest rate must be between 0.1% and 20%,
  property value must be a positive number, and purchase price
  must be a positive number when transaction type is "purchase".
- **FR-003**: System MUST generate a unique reference number for
  each submitted application.
- **FR-004**: System MUST persist all application data and
  decisions to local storage.
- **FR-005**: System MUST display a list of all pending
  applications for loan officers.
- **FR-006**: System MUST allow a loan officer to approve or
  reject a pending application with an optional decision note.
- **FR-007**: System MUST prevent modification of a decision
  once recorded (approve/reject is final).
- **FR-008**: System MUST allow borrowers to look up their
  application status using their reference number.
- **FR-009**: System MUST display clear, human-readable error
  messages for all validation failures and system errors.
- **FR-010**: System MUST support both a borrower-facing view
  (submit and check status) and an officer-facing view (review
  and decide).
- **FR-011**: System MUST auto-calculate mortgage qualification
  for each application using the formulas defined in the Mortgage
  Loan Evaluation Specification (DTI, LTV, front-end ratio,
  asset tests, credit score check). The result is advisory only.
- **FR-012**: System MUST display the qualification summary to
  the loan officer: GMI, PHE, TMD, Front-End %, DTI %, LTV %,
  Reserve Months, Credit Score, Qualified (Yes/No), and a list
  of failed tests.
- **FR-013**: System MUST allow the loan officer to override the
  system qualification result — approving a "Not Qualified"
  application or rejecting a "Qualified" one.
- **FR-014**: System MUST use hardcoded default values for
  property taxes (1.2% of property value annually), homeowners
  insurance ($1,200/year), HOA fees ($0/month), mortgage
  insurance (0.5% of loan amount annually if LTV > 80%, else $0),
  available verified assets (equal to down payment + 6 months of
  estimated housing expense), required funds to close (3% of
  loan amount), and required reserve months (2 months of PHE).
  These defaults are used for all qualification calculations.
- **FR-015**: System MUST use the following conventional loan
  qualification thresholds: Maximum DTI (back-end) 43%, Maximum
  Front-End Ratio 28%, Maximum LTV 97%, Minimum Credit Score 620,
  Required Reserve Months 2. An application passes qualification
  only if all thresholds are met per the Mortgage Loan Evaluation
  Specification decision logic.
- **FR-016**: System MUST calculate the Qualifying Value (QV)
  based on transaction type: QV = min(Purchase Price, Property
  Value) for purchase transactions; QV = Property Value for
  refinance transactions. QV is used in LTV calculations.
- **FR-017**: System MUST support a single borrower per
  application. GMI is derived as: annual income / 12. Co-borrower
  support is out of scope for v1.

### Key Entities

- **Loan Application**: Represents a borrower's mortgage loan
  request. Key attributes: reference number, applicant name,
  applicant email, annual income (used to derive GMI), existing
  monthly debts, credit score, transaction type (purchase or
  refinance), loan amount, loan term, interest rate, property
  value, purchase price (purchase transactions only), property
  taxes (monthly, hardcoded default), homeowners insurance
  (monthly, hardcoded default), HOA fees (monthly, hardcoded
  default), mortgage insurance (monthly if applicable, hardcoded
  default), available verified assets (hardcoded default),
  required funds to close (hardcoded default), status
  (Pending/Approved/Rejected), submission date.
- **Qualification Result**: Represents the system's auto-calculated
  advisory assessment. Key attributes: GMI, PHE, TMD, Front-End %,
  DTI %, LTV %, Reserve Months, credit score, Qualified (Yes/No),
  list of failed tests, calculation date.
- **Decision**: Represents an officer's final ruling on an
  application. Key attributes: decision type (Approved/Rejected),
  decision note, whether the decision overrides the system
  qualification, decision date, linked application reference.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A borrower can complete and submit a loan
  application in under 2 minutes.
- **SC-002**: A loan officer can review and decide on an
  application in under 1 minute.
- **SC-003**: 95% of borrowers successfully submit an application
  on their first attempt without encountering unrecoverable errors.
- **SC-004**: Application status lookup returns results within
  2 seconds of entering a reference number.
- **SC-005**: All form validation errors are specific enough that
  users can correct them without external help.

## Clarifications

### Session 2026-03-25

- Q: Should the mortgage qualification engine be fully automated, advisory (officer makes final call), or manual (officer sees raw data only)? → A: Advisory — system auto-calculates qualification (Qualified Yes/No + failed tests), officer makes the final decision and may override.
- Q: Who enters the additional mortgage data (property details, insurance, taxes, HOA, reserves)? → A: Borrower enters basics (income, debts, credit score, loan details, property value/price); system uses hardcoded defaults for taxes, insurance, HOA, mortgage insurance, assets, funds to close, and reserves.
- Q: What qualification thresholds should v1 use? → A: Conventional loan defaults — Max DTI 43%, Max Front-End 28%, Max LTV 97%, Min Credit Score 620, 2 months reserves.
- Q: Should v1 support both purchase and refinance transactions? → A: Yes, both. Borrower selects transaction type; QV = min(PP, PV) for purchase, QV = PV for refinance. Purchase price field is conditional on transaction type.
- Q: Should v1 support co-borrowers (multiple borrowers per application)? → A: No. Single borrower only; GMI is derived from the single applicant's annual income. Co-borrower support deferred to v2.

## Assumptions

- This is a single-user local application; concurrent multi-user
  access is out of scope for v1.
- Authentication and authorization are out of scope — the
  application assumes a trusted local environment where the user
  switches between "borrower" and "officer" views.
- No external integrations (credit bureaus, payment systems,
  email notifications) are in scope for v1.
- Single borrower per application; co-borrower support (multiple
  income sources, shared debts) is deferred to v2.
- Subordinate financing / CLTV calculation is out of scope for v1
  (single primary mortgage only).
- The loan amount range (1,000–500,000) and term range (6–360
  months) are reasonable defaults and can be adjusted later.
- Mobile-responsive design is desirable but tablet/desktop is the
  primary target for v1.
