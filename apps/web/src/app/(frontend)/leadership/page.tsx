import { getPayloadClient } from "@/lib/payload";
import { roleOrder } from "@/lib/format";
import { PersonCard } from "@/components/person-card";

export const revalidate = 60;

export default async function LeadershipPage() {
  const payload = await getPayloadClient();
  const { docs: people } = await payload.find({
    collection: "people",
    limit: 100,
    depth: 1,
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
          <p className="text-sm font-semibold uppercase tracking-wide text-white/80 mb-2">
            Leadership
          </p>
          <h1 className="text-white mb-4">SCRA Executive Committee</h1>
          <p className="max-w-2xl text-white/90 text-lg">
            The people leading SCRA&apos;s work on behalf of South Coast
            residents and property owners.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-[min(1280px,92%)]">
          <div className="grid gap-8 sm:grid-cols-2">
            {sorted.map((person) => {
              const photo =
                person.photo && typeof person.photo === "object"
                  ? person.photo
                  : null;
              return (
                <PersonCard
                  key={person.id}
                  name={person.name}
                  role={person.role}
                  photoUrl={photo?.url}
                  photoAlt={photo?.alt}
                  bio={person.bio}
                />
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
