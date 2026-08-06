import { getPayloadClient } from "@/lib/payload";

export async function getDefaultThumbnail() {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "media",
    where: { filename: { equals: "no-photo.jpg" } },
    limit: 1,
  });
  const doc = docs[0];
  return doc?.url
    ? { url: doc.url as string, alt: (doc.alt as string) ?? "No photo" }
    : null;
}
