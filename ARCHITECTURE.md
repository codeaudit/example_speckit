# LoanPro Architecture

## Overview
LoanPro is a Mortgage Loan Processing system built using modern web technologies. It provides functionality for users to apply for mortgage loans, check their application status, browse a customer directory, and allows loan officers to review and make decisions on applications.

## Tech Stack
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI Library**: [React](https://reactjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [SQLite](https://sqlite.org/) via [`better-sqlite3`](https://github.com/WiseLibs/better-sqlite3) (supports both file-based and in-memory databases)
- **Testing**: [Vitest](https://vitest.dev/) and React Testing Library

## Project Structure
The application follows a standard Next.js directory structure:

- `src/app/`: Contains the Next.js App Router definitions.
  - `page.tsx`: The main landing page.
  - `layout.tsx`: The root layout of the application.
  - `api/`: Backend API routes (e.g., `/api/applications`, `/api/customers`).
  - `apply/`, `customers/`, `officer/`, `status/`: Frontend page routes corresponding to the main features.
- `src/components/`: Reusable React components used across different pages (e.g., `loan-form.tsx`, `customer-list.tsx`, `app-shell.tsx`).
- `src/lib/`: Core business logic, database configuration, and utility functions.
  - `db.ts`: Database connection and schema migrations.
  - `qualification.ts`: The core engine that calculates mortgage qualifications.
  - `defaults.ts`: Default constants used in calculations.
  - `validation.ts`: Input validation logic.
  - `seed-data.ts`: Initial seed data for the database.
- `src/types/`: TypeScript type definitions and interfaces for the application (e.g., `LoanApplication`, `Customer`, `QualificationResult`).

## Database Schema
The application uses SQLite and manages migrations in `src/lib/db.ts`. The main tables are:

1.  **`customers`**: Stores customer information (name, email, phone, address).
2.  **`loan_applications`**: Stores details of loan applications, including financial metrics, application status (`Pending`, `Approved`, `Rejected`), and serialized qualification data.
3.  **`decisions`**: Stores the loan officer's decision for a specific application, including approval/rejection notes and override flags.

## Core Logic: Qualification Engine
The core business logic resides in `src/lib/qualification.ts`. When a user submits an application, the engine evaluates their financial details to determine if they qualify for the loan. Key calculations include:

-   **GMI (Gross Monthly Income)**
-   **PHE (Principal, Housing, Expenses)**: Including Property Tax, Insurance, HOA, and Mortgage Insurance.
-   **LTV (Loan-to-Value) Ratio**
-   **DTI (Debt-to-Income) Ratio**
-   **Front-End Ratio**
-   **Reserve Months**

The application automatically checks these metrics against configured maximums and minimums (e.g., MAX_DTI, MIN_CREDIT_SCORE) to generate a `QualificationResult`.
