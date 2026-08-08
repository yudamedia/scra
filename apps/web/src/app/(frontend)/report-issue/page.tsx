import Link from "next/link";
import { IssueReportForm } from "@/components/issue-report-form";

export default function ReportIssuePage() {
  return (
    <section className="py-16">
      <div className="mx-auto w-[min(720px,92%)]">
        <p className="text-sm font-semibold uppercase tracking-wide text-secondary mb-2">
          Community Reporting
        </p>
        <h1 className="mb-4">Report an Issue</h1>
        <p className="text-muted-foreground mb-8">
          Tell us about a road, security, environmental, or other issue affecting your area. No
          membership required — you&apos;ll get a reference code to track progress. Already have one?{" "}
          <Link href="/report-issue/status" className="text-secondary hover:underline">
            Check status
          </Link>
          .
        </p>
        <IssueReportForm />
      </div>
    </section>
  );
}
