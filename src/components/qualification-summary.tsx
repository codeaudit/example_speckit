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
    <div className="rounded-md border border-gray-200 bg-white p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-lg font-semibold ${pass ? "text-green-700" : "text-red-700"}`}>
        {value}
      </p>
      <p className={`text-xs font-medium ${pass ? "text-green-600" : "text-red-600"}`}>
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
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
            Qualified
          </span>
        ) : (
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800">
            Not Qualified
          </span>
        )}
      </div>

      {/* Financial figures */}
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-md border border-gray-200 bg-white p-3">
          <p className="text-xs text-gray-500">Gross Monthly Income (GMI)</p>
          <p className="text-lg font-semibold">{formatCurrency(data.gmi)}</p>
        </div>
        <div className="rounded-md border border-gray-200 bg-white p-3">
          <p className="text-xs text-gray-500">
            Proposed Housing Expense (PHE)
          </p>
          <p className="text-lg font-semibold">{formatCurrency(data.phe)}</p>
        </div>
        <div className="rounded-md border border-gray-200 bg-white p-3">
          <p className="text-xs text-gray-500">Total Monthly Debts (TMD)</p>
          <p className="text-lg font-semibold">{formatCurrency(data.tmd)}</p>
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
        <div className="rounded-md bg-red-50 p-3">
          <p className="mb-1 text-xs font-medium text-red-800">
            Failed Tests:
          </p>
          <ul className="list-inside list-disc text-sm text-red-700">
            {data.failedTests.map((test) => (
              <li key={test}>{test}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
