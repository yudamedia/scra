import { getPayloadClient } from "@/lib/payload";
import { getMapMarkers } from "@/lib/map-categories";
import MapView from "@/components/map/map-view";

export const revalidate = 60;

export default async function MapPage() {
  const payload = await getPayloadClient();

  const [{ docs: issues }, { docs: directoryEntries }, pageIntros] = await Promise.all([
    payload.find({
      collection: "issues",
      limit: 200,
      depth: 1,
    }),
    payload.find({
      collection: "directory-entries",
      limit: 200,
      depth: 1,
    }),
    payload.findGlobal({ slug: "page-intros" }),
  ]);
  const intro = pageIntros.map;

  const markers = getMapMarkers({ issues, directoryEntries });

  return (
    <>
      <section className="bg-muted py-16 md:py-20">
        <div className="mx-auto w-[min(1280px,92%)]">
          {intro?.eyebrow && (
            <p className="text-sm font-semibold uppercase tracking-wide text-secondary mb-2">
              {intro.eyebrow}
            </p>
          )}
          <h1 className="mb-4">{intro?.heading}</h1>
          {intro?.paragraph && <p className="max-w-2xl text-muted-foreground text-lg">{intro.paragraph}</p>}
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-[min(1280px,92%)]">
          <MapView markers={markers} />
        </div>
      </section>
    </>
  );
}
