import StatusLookup from "@/components/status-lookup";

export default function StatusPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold font-headline text-on-surface">Check Application Status</h1>
      <p className="mb-6 text-sm text-on-surface-variant">
        Enter your reference number to look up the status of your loan
        application.
      </p>
      <div className="mx-auto max-w-xl">
        <StatusLookup />
      </div>
    </div>
  );
}
