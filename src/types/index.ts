export type TransactionType = "purchase" | "refinance";

export type ApplicationStatus = "Pending" | "Approved" | "Rejected";

export type DecisionType = "Approved" | "Rejected";

export interface LoanApplicationInput {
  applicantName: string;
  applicantEmail: string;
  annualIncome: number;
  monthlyDebts: number;
  creditScore: number;
  transactionType: TransactionType;
  loanAmount: number;
  loanTermMonths: number;
  interestRate: number;
  propertyValue: number;
  purchasePrice: number | null;
}

export interface LoanApplication extends LoanApplicationInput {
  id: number;
  referenceNumber: string;
  status: ApplicationStatus;
  qualificationData: QualificationResult | null;
  createdAt: string;
}

export interface QualificationInput {
  annualIncome: number;
  monthlyDebts: number;
  creditScore: number;
  transactionType: TransactionType;
  loanAmount: number;
  loanTermMonths: number;
  interestRate: number;
  propertyValue: number;
  purchasePrice: number | null;
}

export interface QualificationResult {
  gmi: number;
  phe: number;
  tmd: number;
  frontEndPercent: number;
  dtiPercent: number;
  ltvPercent: number;
  reserveMonths: number;
  creditScore: number;
  qualified: boolean;
  failedTests: string[];
  calculatedAt: string;
}

export interface Decision {
  id: number;
  applicationId: number;
  decisionType: DecisionType;
  decisionNote: string | null;
  isOverride: boolean;
  decidedAt: string;
}

export interface DecisionInput {
  decisionType: DecisionType;
  decisionNote?: string | null;
}

export interface ApiError {
  error: string;
  fields?: Record<string, string>;
}

export interface ApplicationSummary {
  id: number;
  referenceNumber: string;
  applicantName: string;
  loanAmount: number;
  transactionType: TransactionType;
  qualified: boolean | null;
  status: ApplicationStatus;
  createdAt: string;
}

export interface ApplicationDetail extends LoanApplication {
  decision: Decision | null;
}

export interface BorrowerStatusResponse {
  id: number;
  referenceNumber: string;
  applicantName: string;
  loanAmount: number;
  transactionType: TransactionType;
  status: ApplicationStatus;
  decision: {
    decisionType: DecisionType;
    decisionNote: string | null;
    decidedAt: string;
  } | null;
  createdAt: string;
}

export interface Customer {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  createdAt: string;
}

export interface CustomerSummary {
  id: number;
  fullName: string;
  email: string;
}
