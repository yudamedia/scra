import { getPayloadClient } from "@/lib/payload";
import { IssueCard } from "@/components/issue-card";

export const revalidate = 60;

export default async function IssuesIndexPage() {
  const payload = await getPayloadClient();
  const { docs: issues } = await payload.find({
    collection: "issues",
    limit: 100,
    sort: "title",
  });

  const statusOrder = ["received", "under-review", "in-progress", "resolved"];
  const sorted = [...issues].sort(
    (a, b) => statusOrder.indexOf(String(a.status)) - statusOrder.indexOf(String(b.status))
  );

  return (
    <>
      <section className="bg-muted py-16 md:py-20">
        <div className="mx-auto w-[min(1280px,92%)]">
          <p className="text-sm font-semibold uppercase tracking-wide text-secondary mb-2">
            South Coast Issues
          </p>
          <h1 className="mb-4">Tracking the Issues That Matter</h1>
          <p className="max-w-2xl text-muted-foreground text-lg">
            From beach access to environmental protection, here&apos;s what
            SCRA is working on across the South Coast — and what&apos;s
            already been resolved.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-[min(1280px,92%)]">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {sorted.map((issue) => (
              <IssueCard
                key={issue.id}
                slug={String(issue.slug)}
                title={issue.title}
                category={String(issue.category)}
                status={String(issue.status)}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
