import { getPayloadClient } from "@/lib/payload";
import { directoryCategoryLabels } from "@/lib/format";

export const revalidate = 60;

export default async function DirectoryPage() {
  const payload = await getPayloadClient();
  const { docs: entries } = await payload.find({
    collection: "directory-entries",
    limit: 200,
    sort: "name",
  });

  const grouped = entries.reduce<Record<string, typeof entries>>((acc, entry) => {
    const key = String(entry.category);
    if (!acc[key]) acc[key] = [];
    acc[key].push(entry);
    return acc;
  }, {});

  const categoryOrder = Object.keys(directoryCategoryLabels);
  const sortedCategories = categoryOrder.filter((cat) => grouped[cat]?.length > 0);

  return (
    <>
      <section className="bg-muted py-16 md:py-20">
        <div className="mx-auto w-[min(1280px,92%)]">
          <p className="text-sm font-semibold uppercase tracking-wide text-secondary mb-2">
            Community Directory
          </p>
          <h1 className="mb-4">Essential South Coast Services</h1>
          <p className="max-w-2xl text-muted-foreground text-lg">
            Hospitals, emergency contacts, member businesses, and partner
            organisations across the South Coast.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-[min(1280px,92%)] space-y-14">
          {sortedCategories.map((category) => (
            <div key={category}>
              <h2 className="mb-6">{directoryCategoryLabels[category]}</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {grouped[category].map((entry) => (
                  <div key={entry.id} className="bg-card rounded-lg shadow-sm p-6">
                    <h3 className="text-primary text-lg mb-2">{entry.name}</h3>
                    {entry.description && (
                      <p className="text-muted-foreground text-sm mb-4">
                        {entry.description}
                      </p>
                    )}
                    <div className="flex flex-col gap-1 text-sm">
                      {entry.phone && (
                        
                        <a
                          href={`tel:${entry.phone}`}
                          className="text-secondary hover:text-primary transition-colors"
                        >
                          {entry.phone}
                        </a>
                      )}
                      {entry.email && (
                        
                        <a
                          href={`mailto:${entry.email}`}
                          className="text-secondary hover:text-primary transition-colors"
                        >
                          {entry.email}
                        </a>
                      )}
                      {entry.website && (
                        
                        <a
                          href={entry.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-secondary hover:text-primary transition-colors"
                        >
                          {entry.website}
                        </a>
                      )}
                      {entry.address && (
                        <span className="text-muted-foreground">{entry.address}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
