import ApplicationList from "@/components/application-list";

export default function OfficerPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-headline text-on-surface">Intelligence Dashboard</h1>
        <p className="mt-1 text-sm text-on-surface-variant">Loan portfolio overview and pending applications</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Applications table — 8 cols */}
        <div className="col-span-12 lg:col-span-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold font-headline text-on-surface">Pending Applications</h2>
          </div>
          <ApplicationList />
        </div>

        {/* Portfolio risk summary — 4 cols */}
        <div className="col-span-12 lg:col-span-4">
          <div className="rounded-xl bg-surface-container-low p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-on-surface-variant text-xl">analytics</span>
              <h2 className="text-base font-semibold font-headline text-on-surface">Market Pulse</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-on-surface-variant mb-1">Portfolio Risk Score</p>
                <div className="h-2 rounded-full bg-surface-container-high">
                  <div className="h-2 rounded-full bg-primary w-2/3" />
                </div>
                <p className="text-xs text-on-surface-variant mt-1">Moderate — 66/100</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-surface-container-lowest p-3">
                  <p className="text-xs text-on-surface-variant">Avg DTI</p>
                  <p className="text-lg font-semibold text-on-surface">38.2%</p>
                </div>
                <div className="rounded-lg bg-surface-container-lowest p-3">
                  <p className="text-xs text-on-surface-variant">Avg LTV</p>
                  <p className="text-lg font-semibold text-on-surface">82.1%</p>
                </div>
                <div className="rounded-lg bg-surface-container-lowest p-3">
                  <p className="text-xs text-on-surface-variant">Avg Credit</p>
                  <p className="text-lg font-semibold text-on-surface">712</p>
                </div>
                <div className="rounded-lg bg-surface-container-lowest p-3">
                  <p className="text-xs text-on-surface-variant">Qualify Rate</p>
                  <p className="text-lg font-semibold text-on-surface">71%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
