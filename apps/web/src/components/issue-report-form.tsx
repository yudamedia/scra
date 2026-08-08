"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { issueReportCategoryLabels } from "@/lib/format";
import { issueReportCategories } from "@/lib/issue-report-schema";

const inputClass =
  "w-full rounded-md border border-input bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring";
const labelClass = "block text-sm font-medium text-foreground mb-1.5";

export function IssueReportForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [referenceCode, setReferenceCode] = useState<string | null>(null);
  const renderedAt = useRef<number | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    renderedAt.current = Date.now();
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("renderedAt", String(renderedAt.current ?? Date.now()));

    try {
      const res = await fetch("/api/issue-reports", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      setReferenceCode(json.referenceCode);
      formRef.current?.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
      return;
    }
    setStatus("idle");
  }

  if (referenceCode) {
    return (
      <div className="bg-card rounded-lg shadow-sm p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-secondary mb-2">
          Report Submitted
        </p>
        <p className="text-3xl font-heading font-bold text-primary mb-4">{referenceCode}</p>
        <p className="text-muted-foreground text-sm">
          Save this reference code to check your report&apos;s status at any time on the{" "}
          <a href="/report-issue/status" className="text-secondary hover:underline">
            status lookup page
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setReferenceCode(null)}
          className="mt-6 text-sm text-secondary hover:underline"
        >
          Submit another report
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="bg-card rounded-lg shadow-sm p-8 space-y-5">
      {/* Honeypot — hidden from real visitors via CSS, left plainly visible to naive bots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="reporterName" className={labelClass}>
            Your Name
          </label>
          <input id="reporterName" name="reporterName" type="text" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="reporterPhone" className={labelClass}>
            Phone (optional)
          </label>
          <input id="reporterPhone" name="reporterPhone" type="tel" className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="reporterEmail" className={labelClass}>
          Email (optional — for status updates)
        </label>
        <input id="reporterEmail" name="reporterEmail" type="email" className={inputClass} />
      </div>

      <div>
        <label htmlFor="category" className={labelClass}>
          Category
        </label>
        <select id="category" name="category" required defaultValue="" className={inputClass}>
          <option value="" disabled>
            Select a category
          </option>
          {issueReportCategories.map((c) => (
            <option key={c} value={c}>
              {issueReportCategoryLabels[c]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          What&apos;s happening?
        </label>
        <textarea id="description" name="description" required rows={5} className={inputClass} />
      </div>

      <div>
        <label htmlFor="addressText" className={labelClass}>
          Location (street, landmark, or area)
        </label>
        <input id="addressText" name="addressText" type="text" className={inputClass} />
      </div>

      <div>
        <label htmlFor="photos" className={labelClass}>
          Photos (optional, up to 3)
        </label>
        <input
          id="photos"
          name="photos"
          type="file"
          accept="image/*"
          multiple
          className="w-full text-sm text-muted-foreground file:mr-4 file:rounded-md file:border-0 file:bg-muted file:px-4 file:py-2 file:text-sm file:font-medium file:text-foreground"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center justify-center rounded-md bg-primary text-white font-semibold text-sm px-6 py-3 hover:bg-primary-dark transition-colors disabled:opacity-60"
      >
        {status === "submitting" ? "Submitting…" : "Submit Report"}
      </button>
    </form>
  );
}
