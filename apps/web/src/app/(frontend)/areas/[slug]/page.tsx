import { notFound } from "next/navigation";
import Link from "next/link";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { getPayloadClient } from "@/lib/payload";

export const revalidate = 60;

export default async function AreaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const payload = await getPayloadClient();

  const { docs } = await payload.find({
    collection: "areas",
    where: { slug: { equals: slug } },
    limit: 1,
  });
  const area = docs[0];
  if (!area) notFound();

  const { docs: relatedIssues } = await payload.find({
    collection: "issues",
    where: { area: { equals: area.id } },
    limit: 10,
  });

  return (
    <>
      <section
        className="text-white py-20 md:py-28"
        style={{
          background:
            "linear-gradient(rgba(13,43,91,.6), rgba(7,28,61,.75)), linear-gradient(135deg, #27C5C3, #0D2B5B)",
        }}
      >
        <div className="mx-auto w-[min(1280px,92%)]">
          <Link
            href="/areas"
            className="text-white/80 text-sm hover:text-white transition-colors"
          >
            ← All Area Guides
          </Link>
          <h1 className="text-white mt-4">{area.name}</h1>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-[min(1280px,92%)] max-w-3xl">
          {area.overview && (
            <div className="prose max-w-none text-foreground [&_p]:mb-4 [&_p]:leading-relaxed">
              <RichText data={area.overview} />
            </div>
          )}

          {Array.isArray(area.keyServices) && area.keyServices.length > 0 && (
            <div className="mt-10">
              <h2 className="text-2xl mb-4">Key Services</h2>
              <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                {area.keyServices.map((item, i) => (
                  <li key={i}>{item.service}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {relatedIssues.length > 0 && (
        <section className="py-16 bg-muted">
          <div className="mx-auto w-[min(1280px,92%)]">
            <h2 className="mb-8">Issues in {area.name}</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {relatedIssues.map((issue) => (
                <div key={issue.id} className="bg-card rounded-lg shadow-sm p-6">
                  <span className="text-xs font-semibold uppercase tracking-wide text-secondary">
                    {String(issue.category).replace(/-/g, " ")}
                  </span>
                  <h3 className="text-primary text-lg mt-2 mb-1">
                    {issue.title}
                  </h3>
                  <span className="text-sm text-muted-foreground capitalize">
                    {String(issue.status).replace(/-/g, " ")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
