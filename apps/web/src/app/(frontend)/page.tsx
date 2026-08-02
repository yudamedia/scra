import Link from "next/link";
import { getPayloadClient } from "@/lib/payload";
import { IssueCard } from "@/components/issue-card";

export const revalidate = 60;

export default async function HomePage() {
  const payload = await getPayloadClient();
  const [{ docs: issues }, { docs: areas }] = await Promise.all([
    payload.find({ collection: "issues", limit: 3, sort: "-updatedAt" }),
    payload.find({ collection: "areas", limit: 9, sort: "name" }),
  ]);

  return (
    <>
      <section
        className="text-white py-[100px] md:py-[160px]"
        style={{
          background:
            "linear-gradient(rgba(13,43,91,.75), rgba(7,28,61,.85)), linear-gradient(135deg, #00B4DB, #0D2B5B)",
        }}
      >
        <div className="mx-auto w-[min(1280px,92%)]">
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl mb-6 max-w-3xl">
            Working Together for a Better South Coast
          </h1>
          <p className="text-white/90 text-lg max-w-xl mb-8">
            Representing residents, property owners and businesses from
            Likoni to Lunga Lunga since 1983.
          </p>
          <Link
            href="/areas"
            className="inline-flex items-center justify-center rounded-md bg-white text-primary font-semibold px-7 py-3.5 hover:bg-white/90 transition-colors"
          >
            Explore Area Guides
          </Link>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto w-[min(1280px,92%)]">
          <h2 className="mb-4">About SCRA</h2>
          <p className="max-w-3xl text-muted-foreground text-lg leading-relaxed">
            SCRA is a non-political, non-profit, non-denominational and
            non-racial association advancing the interests of residents and
            property owners on the South Coast — from Likoni to Lunga Lunga —
            since 1983.
          </p>
        </div>
      </section>

      {issues.length > 0 && (
        <section className="py-24 bg-muted">
          <div className="mx-auto w-[min(1280px,92%)]">
            <h2 className="mb-10">Current Issues</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {issues.map((issue) => (
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
      )}

      <section className="py-24">
        <div className="mx-auto w-[min(1280px,92%)]">
          <div className="flex items-end justify-between mb-10">
            <h2>Area Guides</h2>
            <Link
              href="/areas"
              className="text-secondary font-medium hover:text-primary transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {areas.map((area) => (
              <Link
                key={area.id}
                href={`/areas/${area.slug}`}
                className="block bg-card rounded-lg shadow-sm p-6 hover:-translate-y-1 hover:shadow transition-all"
              >
                <h3 className="text-primary text-lg mb-1">{area.name}</h3>
                <span className="text-sm text-secondary font-medium">
                  View guide →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
