import Link from "next/link";
import { getPayloadClient } from "@/lib/payload";
import { getDefaultThumbnail } from "@/lib/default-thumbnail";

export const revalidate = 60;

export default async function NewsIndexPage() {
  const payload = await getPayloadClient();
  const [{ docs: posts }, defaultThumbnail] = await Promise.all([
    payload.find({
      collection: "posts",
      limit: 100,
      sort: "-publishedDate",
      depth: 1,
    }),
    getDefaultThumbnail(),
  ]);

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
            Newsroom
          </p>
          <h1 className="text-white mb-4">Latest from SCRA</h1>
          <p className="max-w-2xl text-white/90 text-lg">
            Updates, meeting notes, and announcements from the South Coast
            Residents&apos; Association.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto w-[min(1280px,92%)]">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const img =
                post.featuredImage && typeof post.featuredImage === "object"
                  ? post.featuredImage
                  : null;
              return (
                <Link
                  key={post.id}
                  href={`/news/${post.slug}`}
                  className="block bg-card rounded-lg shadow overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all"
                >
                  {(img?.url ?? defaultThumbnail?.url) && (
                    <img
                      src={img?.url ?? defaultThumbnail?.url}
                      alt={img?.alt ?? defaultThumbnail?.alt ?? ""}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-8">
                    <span className="text-xs font-semibold text-muted-foreground">
                      {new Date(post.publishedDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <h2 className="text-primary text-xl mt-2 mb-2">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-muted-foreground text-sm">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
