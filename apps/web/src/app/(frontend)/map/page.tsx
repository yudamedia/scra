import { getPayloadClient } from "@/lib/payload";
import { getMapMarkers } from "@/lib/map-categories";
import MapView from "@/components/map/map-view";

export const revalidate = 60;

export default async function MapPage() {
  const payload = await getPayloadClient();

  const [{ docs: issues }, { docs: directoryEntries }] = await Promise.all([
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
  ]);

  const markers = getMapMarkers({ issues, directoryEntries });

  return (
    <>
      <section className="bg-muted py-16 md:py-20">
        <div className="mx-auto w-[min(1280px,92%)]">
          <p className="text-sm font-semibold uppercase tracking-wide text-secondary mb-2">
            Interactive Map
          </p>
          <h1 className="mb-4">South Coast Map</h1>
          <p className="max-w-2xl text-muted-foreground text-lg">
            Road projects, community facilities, healthcare, schools, and
            environmental areas SCRA tracks across the South Coast — from
            Likoni to Lunga Lunga.
          </p>
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
