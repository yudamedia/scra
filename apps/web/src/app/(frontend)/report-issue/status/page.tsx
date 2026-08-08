"use client";

import { useState, type FormEvent } from "react";
import { issueReportCategoryLabels, issueReportStatusStyles } from "@/lib/format";
import { formatLabel } from "@/lib/format";

type StatusEntry = { status: string; changedAt: string; note?: string };
type ReportStatus = {
  referenceCode: string;
  category: string;
  status: string;
  statusHistory: StatusEntry[];
  createdAt: string;
};

export default function ReportStatusPage() {
  const [code, setCode] = useState("");
  const [report, setReport] = useState<ReportStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setReport(null);
    try {
      const res = await fetch(`/api/issue-reports/status?code=${encodeURIComponent(code.trim())}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Not found");
      setReport(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Not found");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-16">
      <div className="mx-auto w-[min(600px,92%)]">
        <h1 className="mb-6">Check Report Status</h1>
        <form onSubmit={handleSubmit} className="bg-card rounded-lg shadow-sm p-6 flex gap-3 mb-8">
          <input
            type="text"
            required
            placeholder="e.g. SCRA-1042"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 rounded-md border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md bg-primary text-white font-semibold text-sm px-5 py-2.5 hover:bg-primary-dark transition-colors disabled:opacity-60"
          >
            {loading ? "Looking up…" : "Check"}
          </button>
        </form>

        {error && (
          <div className="bg-card rounded-lg shadow-sm p-6 text-center text-muted-foreground text-sm">
            {error}
          </div>
        )}

        {report && (
          <div className="bg-card rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  {issueReportCategoryLabels[report.category] ?? report.category}
                </p>
                <h2 className="text-primary text-lg">{report.referenceCode}</h2>
              </div>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-pill ${
                  issueReportStatusStyles[report.status] ?? "bg-muted text-muted-foreground"
                }`}
              >
                {formatLabel(report.status.replace(/_/g, "-"))}
              </span>
            </div>

            <ol className="space-y-4">
              {[...report.statusHistory].reverse().map((entry, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-secondary shrink-0" />
                  <div>
                    <p className="text-foreground font-medium">
                      {formatLabel(entry.status.replace(/_/g, "-"))}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {new Date(entry.changedAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    {entry.note && <p className="text-muted-foreground mt-1">{entry.note}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}
