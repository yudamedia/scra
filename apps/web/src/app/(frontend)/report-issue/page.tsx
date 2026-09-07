import { getPayloadClient } from "@/lib/payload";
import { IssueReportForm } from "@/components/issue-report-form";
import { renderInlineLinks } from "@/lib/inline-links";

export const revalidate = 60;

export default async function ReportIssuePage() {
  const payload = await getPayloadClient();
  const pageIntros = await payload.findGlobal({ slug: "page-intros" });
  const intro = pageIntros.reportIssue;

  return (
    <section className="py-16">
      <div className="mx-auto w-[min(720px,92%)]">
        {intro?.eyebrow && (
          <p className="text-sm font-semibold uppercase tracking-wide text-secondary mb-2">
            {intro.eyebrow}
          </p>
        )}
        <h1 className="mb-4">{intro?.heading}</h1>
        {intro?.paragraph && (
          <p className="text-muted-foreground mb-8">
            {renderInlineLinks(intro.paragraph, "text-secondary hover:underline")}
          </p>
        )}
        <IssueReportForm />
      </div>
    </section>
  );
}
