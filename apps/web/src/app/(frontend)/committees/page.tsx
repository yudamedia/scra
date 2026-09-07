import { RichText } from "@payloadcms/richtext-lexical/react";
import { getPayloadClient } from "@/lib/payload";

export const revalidate = 60;

export default async function CommitteesPage() {
  const payload = await getPayloadClient();
  const [{ docs: committees }, pageIntros] = await Promise.all([
    payload.find({
      collection: "committees",
      limit: 50,
      sort: "name",
    }),
    payload.findGlobal({ slug: "page-intros" }),
  ]);
  const intro = pageIntros.committees;

  const committeesWithMembers = await Promise.all(
    committees.map(async (committee) => {
      const { docs: members } = await payload.find({
        collection: "people",
        where: { committee: { equals: committee.id } },
        limit: 50,
      });
      return { committee, members };
    })
  );

  return (
    <>
      <section
        className="text-white py-16 md:py-20"
        style={{
          background:
            "linear-gradient(rgba(13,43,91,.72), rgba(7,28,61,.85)), url(/hero/leadership.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto w-[min(1280px,92%)]">
          {intro?.eyebrow && (
            <p className="text-sm font-semibold uppercase tracking-wide text-white/80 mb-2">
              {intro.eyebrow}
            </p>
          )}
          <h1 className="text-white mb-4">{intro?.heading}</h1>
          {intro?.paragraph && <p className="max-w-2xl text-white/90 text-lg">{intro.paragraph}</p>}
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-[min(1280px,92%)] max-w-3xl space-y-12">
          {committeesWithMembers.map(({ committee, members }) => (
            <div key={committee.id} className="bg-card rounded-lg shadow p-8">
              <h2 className="text-primary text-2xl mb-3">{committee.name}</h2>
              {committee.description && (
                <div className="prose max-w-none text-muted-foreground [&_p]:mb-3 [&_p]:leading-relaxed">
                  <RichText data={committee.description} />
                </div>
              )}
              {members.length > 0 ? (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-secondary mb-3">
                    Members
                  </h3>
                  <ul className="flex flex-wrap gap-3">
                    {members.map((person) => (
                      <li
                        key={person.id}
                        className="bg-muted rounded-pill px-4 py-1.5 text-sm text-foreground"
                      >
                        {person.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="mt-6 text-sm text-muted-foreground italic">
                  No members listed yet.
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
