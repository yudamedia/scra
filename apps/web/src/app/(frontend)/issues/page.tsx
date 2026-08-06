import Link from "next/link";
import { getPayloadClient } from "@/lib/payload";
import { IssueCard } from "@/components/issue-card";
import { getDefaultThumbnail } from "@/lib/default-thumbnail";
import { formatLabel } from "@/lib/format";

export const revalidate = 60;

const issueCategories = [
  "roads-infrastructure",
  "security",
  "water-supply",
  "electricity",
  "waste-management",
  "environment",
  "beach-access",
  "planning-development",
];

export default async function IssuesIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeCategory = issueCategories.includes(category ?? "") ? category : undefined;

  const payload = await getPayloadClient();
  const [{ docs: issues }, defaultThumbnail] = await Promise.all([
    payload.find({
      collection: "issues",
      limit: 100,
      sort: "title",
      depth: 1,
      where: activeCategory ? { category: { equals: activeCategory } } : undefined,
    }),
    getDefaultThumbnail(),
  ]);

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
          <h1 className="mb-4">
            {activeCategory ? formatLabel(activeCategory) : "Tracking the Issues That Matter"}
          </h1>
          <p className="max-w-2xl text-muted-foreground text-lg">
            From beach access to environmental protection, here&apos;s what
            SCRA is working on across the South Coast — and what&apos;s
            already been resolved.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            <Link
              href="/issues"
              className={`text-xs font-semibold px-3 py-1.5 rounded-pill transition-colors ${
                !activeCategory
                  ? "bg-primary text-white"
                  : "bg-card text-muted-foreground hover:text-secondary"
              }`}
            >
              All
            </Link>
            {issueCategories.map((cat) => (
              <Link
                key={cat}
                href={`/issues?category=${cat}`}
                className={`text-xs font-semibold px-3 py-1.5 rounded-pill transition-colors ${
                  activeCategory === cat
                    ? "bg-primary text-white"
                    : "bg-card text-muted-foreground hover:text-secondary"
                }`}
              >
                {formatLabel(cat)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-[min(1280px,92%)]">
          {sorted.length === 0 && (
            <p className="text-muted-foreground">No issues found in this category yet.</p>
          )}
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {sorted.map((issue) => {
              const img =
                issue.featuredImage && typeof issue.featuredImage === "object"
                  ? issue.featuredImage
                  : null;
              return (
                <IssueCard
                  key={issue.id}
                  slug={String(issue.slug)}
                  title={issue.title}
                  category={String(issue.category)}
                  status={String(issue.status)}
                  imageUrl={img?.url ?? defaultThumbnail?.url}
                  imageAlt={img?.alt ?? defaultThumbnail?.alt}
                />
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
