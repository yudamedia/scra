import { notFound } from "next/navigation";
import Link from "next/link";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { getPayloadClient } from "@/lib/payload";
import { formatLabel, statusStyles } from "@/lib/format";

export const revalidate = 60;

export default async function IssueDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const payload = await getPayloadClient();

  const { docs } = await payload.find({
    collection: "issues",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  });
  const issue = docs[0];
  if (!issue) notFound();

  const area =
    issue.area && typeof issue.area === "object" ? issue.area : null;
  const supportingDocuments = Array.isArray(issue.supportingDocuments)
    ? issue.supportingDocuments.filter((d): d is Exclude<typeof d, number> => typeof d === "object")
    : [];
  const relatedNews = Array.isArray(issue.relatedNews)
    ? issue.relatedNews.filter((p): p is Exclude<typeof p, number> => typeof p === "object")
    : [];
  const progressUpdates = Array.isArray(issue.progressUpdates)
    ? [...issue.progressUpdates].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    : [];

  return (
    <>
      <section className="bg-muted py-16 md:py-20">
        <div className="mx-auto w-[min(1280px,92%)] max-w-3xl">
          <Link
            href="/issues"
            className="text-secondary text-sm hover:text-primary transition-colors"
          >
            ← All Issues
          </Link>
          <div className="flex flex-wrap items-center gap-3 mt-4 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-secondary">
              {formatLabel(String(issue.category))}
            </span>
            <span
              className={`inline-block text-xs font-semibold px-3 py-1 rounded-pill ${statusStyles[String(issue.status)] ?? "bg-muted text-muted-foreground"}`}
            >
              {formatLabel(String(issue.status))}
            </span>
          </div>
          <h1 className="mb-2">{issue.title}</h1>
          {area && (
            <Link
              href={`/areas/${area.slug}`}
              className="text-muted-foreground hover:text-secondary transition-colors text-sm"
            >
              Located in {area.name}
            </Link>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-[min(1280px,92%)] max-w-3xl">
          {issue.background && (
            <div>
              <h2 className="text-2xl mb-4">Background</h2>
              <div className="prose max-w-none text-foreground [&_p]:mb-4 [&_p]:leading-relaxed">
                <RichText data={issue.background} />
              </div>
            </div>
          )}

          {issue.actionsUndertaken && (
            <div className="mt-10">
              <h2 className="text-2xl mb-4">Actions Undertaken</h2>
              <div className="prose max-w-none text-foreground [&_p]:mb-4 [&_p]:leading-relaxed">
                <RichText data={issue.actionsUndertaken} />
              </div>
            </div>
          )}

          {progressUpdates.length > 0 && (
            <div className="mt-10">
              <h2 className="text-2xl mb-4">Progress Updates</h2>
              <ul className="space-y-4">
                {progressUpdates.map((update, i) => (
                  <li key={i} className="border-l-2 border-secondary pl-4">
                    <span className="block text-sm font-semibold text-secondary">
                      {new Date(update.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <span className="text-muted-foreground">{update.update}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {supportingDocuments.length > 0 && (
            <div className="mt-10">
              <h2 className="text-2xl mb-4">Supporting Documents</h2>
              <ul className="space-y-2">
                {supportingDocuments.map((doc) => (
                  <li key={doc.id}>
                    {doc.url ? (
                      
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-secondary hover:text-primary transition-colors font-medium"
                      >
                        {doc.title}
                      </a>
                    ) : (
                      <span className="text-muted-foreground">{doc.title}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {relatedNews.length > 0 && (
            <div className="mt-10">
              <h2 className="text-2xl mb-4">Related News</h2>
              <ul className="space-y-2">
                {relatedNews.map((post) => (
                  <li key={post.id} className="text-muted-foreground">
                    {post.title}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
