import type { QualificationResult } from "@/types";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

function Metric({
  label,
  value,
  pass,
}: {
  label: string;
  value: string;
  pass: boolean;
}) {
  return (
    <div className="rounded-md border border-border-default bg-bg-page p-3">
      <p className="text-xs font-medium uppercase text-text-muted">{label}</p>
      <p className={`text-lg font-semibold ${pass ? "text-status-approved" : "text-status-rejected"}`}>
        {value}
      </p>
      <p className={`text-xs font-medium ${pass ? "text-status-approved" : "text-status-rejected"}`}>
        {pass ? "Pass" : "Fail"}
      </p>
    </div>
  );
}

interface QualificationSummaryProps {
  data: QualificationResult;
}

export default function QualificationSummary({
  data,
}: QualificationSummaryProps) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <h3 className="text-base font-semibold">Qualification Summary</h3>
        {data.qualified ? (
          <span className="rounded-full bg-status-approved-bg px-3 py-1 text-xs font-medium text-status-approved shadow-sm ring-1 ring-inset ring-status-approved/20">
            Qualified
          </span>
        ) : (
          <span className="rounded-full bg-status-rejected-bg px-3 py-1 text-xs font-medium text-status-rejected shadow-sm ring-1 ring-inset ring-status-rejected/20">
            Not Qualified
          </span>
        )}
      </div>

      {/* Financial figures */}
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-md border border-border-default bg-bg-page p-3">
          <p className="text-xs text-text-muted">Gross Monthly Income (GMI)</p>
          <p className="text-lg font-semibold text-text-primary">{formatCurrency(data.gmi)}</p>
        </div>
        <div className="rounded-md border border-border-default bg-bg-page p-3">
          <p className="text-xs text-text-muted">
            Proposed Housing Expense (PHE)
          </p>
          <p className="text-lg font-semibold text-text-primary">{formatCurrency(data.phe)}</p>
        </div>
        <div className="rounded-md border border-border-default bg-bg-page p-3">
          <p className="text-xs text-text-muted">Total Monthly Debts (TMD)</p>
          <p className="text-lg font-semibold text-text-primary">{formatCurrency(data.tmd)}</p>
        </div>
      </div>

      {/* Qualification metrics */}
      <div className="mb-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Metric
          label="Front-End Ratio"
          value={`${data.frontEndPercent.toFixed(1)}%`}
          pass={data.frontEndPercent <= 28}
        />
        <Metric
          label="DTI Ratio"
          value={`${data.dtiPercent.toFixed(1)}%`}
          pass={data.dtiPercent <= 43}
        />
        <Metric
          label="LTV Ratio"
          value={`${data.ltvPercent.toFixed(1)}%`}
          pass={data.ltvPercent <= 97}
        />
        <Metric
          label="Reserve Months"
          value={data.reserveMonths.toFixed(1)}
          pass={data.reserveMonths >= 2}
        />
        <Metric
          label="Credit Score"
          value={data.creditScore.toString()}
          pass={data.creditScore >= 620}
        />
      </div>

      {data.failedTests.length > 0 && (
        <div className="rounded-md bg-status-rejected-bg p-3">
          <p className="mb-1 text-xs font-medium text-status-rejected">
            Failed Tests:
          </p>
          <ul className="list-inside list-disc text-sm text-status-rejected">
            {data.failedTests.map((test) => (
              <li key={test}>{test}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
