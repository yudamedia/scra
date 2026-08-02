import { RichText } from "@payloadcms/richtext-lexical/react";
import { getPayloadClient } from "@/lib/payload";
import { roleOrder } from "@/lib/format";

export const revalidate = 60;

export default async function LeadershipPage() {
  const payload = await getPayloadClient();
  const { docs: people } = await payload.find({
    collection: "people",
    limit: 100,
  });

  const sorted = [...people].sort((a, b) => {
    const aIndex = roleOrder.indexOf(a.role);
    const bIndex = roleOrder.indexOf(b.role);
    const aRank = aIndex === -1 ? roleOrder.length : aIndex;
    const bRank = bIndex === -1 ? roleOrder.length : bIndex;
    if (aRank !== bRank) return aRank - bRank;
    return a.name.localeCompare(b.name);
  });

  return (
    <>
      <section className="bg-muted py-16 md:py-20">
        <div className="mx-auto w-[min(1280px,92%)]">
          <p className="text-sm font-semibold uppercase tracking-wide text-secondary mb-2">
            Leadership
          </p>
          <h1 className="mb-4">SCRA Executive Committee</h1>
          <p className="max-w-2xl text-muted-foreground text-lg">
            The people leading SCRA&apos;s work on behalf of South Coast
            residents and property owners.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-[min(1280px,92%)]">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((person) => (
              <div key={person.id} className="bg-card rounded-lg shadow p-8">
                <h2 className="text-primary text-xl mb-1">{person.name}</h2>
                <p className="text-secondary font-semibold text-sm mb-4">
                  {person.role}
                </p>
                {person.bio && (
                  <div className="prose max-w-none text-muted-foreground text-sm [&_p]:mb-3 [&_p]:leading-relaxed">
                    <RichText data={person.bio} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
