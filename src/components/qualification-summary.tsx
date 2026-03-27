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
    <div className="rounded-xl bg-surface-container-lowest p-3">
      <p className="text-xs font-medium uppercase text-on-surface-variant">{label}</p>
      <p className={`text-lg font-semibold ${pass ? "text-green-700" : "text-error"}`}>
        {value}
      </p>
      <p className={`text-xs font-medium ${pass ? "text-green-600" : "text-error"}`}>
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
        <h3 className="text-base font-semibold font-headline text-on-surface">Qualification Summary</h3>
        {data.qualified ? (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
            Qualified
          </span>
        ) : (
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200">
            Not Qualified
          </span>
        )}
      </div>

      {/* Financial figures */}
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-surface-container-lowest p-3">
          <p className="text-xs text-on-surface-variant">Gross Monthly Income (GMI)</p>
          <p className="text-lg font-semibold text-on-surface">{formatCurrency(data.gmi)}</p>
        </div>
        <div className="rounded-xl bg-surface-container-lowest p-3">
          <p className="text-xs text-on-surface-variant">
            Proposed Housing Expense (PHE)
          </p>
          <p className="text-lg font-semibold text-on-surface">{formatCurrency(data.phe)}</p>
        </div>
        <div className="rounded-xl bg-surface-container-lowest p-3">
          <p className="text-xs text-on-surface-variant">Total Monthly Debts (TMD)</p>
          <p className="text-lg font-semibold text-on-surface">{formatCurrency(data.tmd)}</p>
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
        <div className="rounded-xl bg-error-container p-3">
          <p className="mb-1 text-xs font-medium text-on-error-container">
            Failed Tests:
          </p>
          <ul className="list-inside list-disc text-sm text-on-error-container">
            {data.failedTests.map((test) => (
              <li key={test}>{test}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
