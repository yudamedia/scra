import { notFound } from "next/navigation";
import Link from "next/link";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { getPayloadClient } from "@/lib/payload";

export const revalidate = 60;

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const payload = await getPayloadClient();

  const { docs } = await payload.find({
    collection: "posts",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  });
  const post = docs[0];
  if (!post) notFound();

  const img =
    post.featuredImage && typeof post.featuredImage === "object"
      ? post.featuredImage
      : null;
  const relatedIssues = Array.isArray(post.relatedIssues)
    ? post.relatedIssues.filter(
        (i): i is Exclude<typeof i, number> => typeof i === "object"
      )
    : [];

  return (
    <>
      {(() => {
        const hasImage = Boolean(img?.url);
        return (
          <section
            className={`py-16 md:py-24 ${hasImage ? "text-white" : "bg-muted"}`}
            style={
              hasImage
                ? {
                    background: `linear-gradient(rgba(13,43,91,.65), rgba(7,28,61,.8)), url(${img!.url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : undefined
            }
          >
            <div className="mx-auto w-[min(1280px,92%)] max-w-3xl">
              <Link
                href="/news"
                className={`text-sm transition-colors ${hasImage ? "text-white/80 hover:text-white" : "text-secondary hover:text-primary"}`}
              >
                ← All News
              </Link>
              <span
                className={`block text-sm font-semibold mt-4 mb-2 ${hasImage ? "text-white/80" : "text-muted-foreground"}`}
              >
                {new Date(post.publishedDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <h1 className={hasImage ? "text-white" : ""}>{post.title}</h1>
            </div>
          </section>
        );
      })()}

      <section className="py-16">
        <div className="mx-auto w-[min(1280px,92%)] max-w-3xl">
          {post.content && (
            <div className="prose max-w-none text-foreground [&_p]:mb-4 [&_p]:leading-relaxed">
              <RichText data={post.content} />
            </div>
          )}

          {relatedIssues.length > 0 && (
            <div className="mt-10">
              <h2 className="text-2xl mb-4">Related Issues</h2>
              <ul className="space-y-2">
                {relatedIssues.map((issue) => (
                  <li key={issue.id}>
                    <Link
                      href={`/issues/${issue.slug}`}
                      className="text-secondary hover:text-primary transition-colors font-medium"
                    >
                      {issue.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
