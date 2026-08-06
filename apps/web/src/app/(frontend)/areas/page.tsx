import Link from "next/link";
import { getPayloadClient } from "@/lib/payload";

export const revalidate = 60;

export default async function AreasIndexPage() {
  const payload = await getPayloadClient();
  const { docs: areas } = await payload.find({
    collection: "areas",
    limit: 50,
    sort: "name",
  });

  return (
    <>
      <section
        className="text-white py-16 md:py-20"
        style={{
          background:
            "linear-gradient(rgba(13,43,91,.72), rgba(7,28,61,.85)), url(/hero/issues.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto w-[min(1280px,92%)]">
          <p className="text-sm font-semibold uppercase tracking-wide text-white/80 mb-2">
            Area Guides
          </p>
          <h1 className="text-white mb-4">The South Coast, Area by Area</h1>
          <p className="max-w-2xl text-white/90 text-lg">
            From the Likoni ferry crossing to the Tanzanian border at Lunga
            Lunga, explore what makes each stretch of the South Coast
            distinct.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-[min(1280px,92%)]">
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {areas.map((area) => (
              <Link
                key={area.id}
                href={`/areas/${area.slug}`}
                className="block bg-card rounded-lg shadow p-8 hover:-translate-y-1 hover:shadow-lg transition-all"
              >
                <h2 className="text-primary text-xl mb-2">{area.name}</h2>
                <span className="text-secondary text-sm font-medium">
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
