import { getPayloadClient } from "@/lib/payload";
import { documentCategoryLabels } from "@/lib/format";
import { HugeiconsIcon } from "@hugeicons/react";
import { File01Icon, Download01Icon } from "@hugeicons/core-free-icons";

export const revalidate = 60;

export default async function DocumentsPage() {
  const payload = await getPayloadClient();
  const { docs: documents } = await payload.find({
    collection: "documents",
    limit: 200,
    sort: "-publishedDate",
  });

  const grouped = documents.reduce<Record<string, typeof documents>>((acc, doc) => {
    const key = String(doc.category);
    if (!acc[key]) acc[key] = [];
    acc[key].push(doc);
    return acc;
  }, {});

  const categoryOrder = Object.keys(documentCategoryLabels);
  const sortedCategories = categoryOrder.filter((cat) => grouped[cat]?.length > 0);

  return (
    <>
      <section className="bg-muted py-16 md:py-20">
        <div className="mx-auto w-[min(1280px,92%)]">
          <p className="text-sm font-semibold uppercase tracking-wide text-secondary mb-2">
            Knowledge Centre
          </p>
          <h1 className="mb-4">Reports, Minutes &amp; Public Documents</h1>
          <p className="max-w-2xl text-muted-foreground text-lg">
            A searchable library of SCRA&apos;s annual reports, meeting
            minutes, position papers, and other public documentation.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-[min(1280px,92%)] space-y-14">
          {sortedCategories.length === 0 && (
            <p className="text-muted-foreground">No documents published yet.</p>
          )}
          {sortedCategories.map((category) => (
            <div key={category}>
              <h2 className="mb-6">{documentCategoryLabels[category]}</h2>
              <div className="grid gap-4">
                {grouped[category].map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.url ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 bg-card rounded-lg shadow-sm p-6 hover:-translate-y-0.5 hover:shadow-md transition-all"
                  >
                    <span className="flex items-center justify-center w-11 h-11 rounded-full bg-secondary/10 text-secondary shrink-0">
                      <HugeiconsIcon icon={File01Icon} size={20} strokeWidth={1.8} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-primary text-base mb-1">{doc.title}</h3>
                      {doc.summary && (
                        <p className="text-muted-foreground text-sm mb-2">{doc.summary}</p>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {new Date(doc.publishedDate).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <HugeiconsIcon
                      icon={Download01Icon}
                      size={18}
                      strokeWidth={1.8}
                      className="text-muted-foreground shrink-0 mt-1"
                    />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
