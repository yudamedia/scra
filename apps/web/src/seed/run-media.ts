import path from "path"
import { fileURLToPath } from "url"
import { getPayload } from "payload"
import config from "@payload-config"
import { mediaData } from "./media-data"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function run() {
  try {
    const payload = await getPayload({ config })
    console.log("Payload initialized.")

    const mediaIdByKey: Record<string, number> = {}
    for (const img of mediaData) {
      const existing = await payload.find({
        collection: "media",
        where: { alt: { equals: img.alt } },
        limit: 1,
      })
      if (existing.docs.length > 0) {
        mediaIdByKey[img.key] = existing.docs[0].id as number
        console.log(`Media already exists: ${img.filename}`)
        continue
      }
      const filePath = path.resolve(__dirname, "source-images", img.filename)
      const created = await payload.create({
        collection: "media",
        data: { alt: img.alt },
        filePath,
      })
      mediaIdByKey[img.key] = created.id as number
      console.log(`Media uploaded: ${img.filename}`)
    }

    // Link the annotated wall photo as the Lotfa issue's featured image
    const lotfaIssue = await payload.find({
      collection: "issues",
      where: { slug: { equals: "lotfa-junction-visibility" } },
      limit: 1,
    })
    if (lotfaIssue.docs[0]) {
      await payload.update({
        collection: "issues",
        id: lotfaIssue.docs[0].id,
        data: { featuredImage: mediaIdByKey["lotfa-wall-annotated"] },
      })
      console.log("Lotfa issue: featuredImage linked.")
    } else {
      console.log("WARNING: lotfa-junction-visibility issue not found.")
    }

    // Link the portrait as the Municipal Update post's featured image
    const municipalPost = await payload.find({
      collection: "posts",
      where: { slug: { equals: "diani-municipality-manager-update" } },
      limit: 1,
    })
    if (municipalPost.docs[0]) {
      await payload.update({
        collection: "posts",
        id: municipalPost.docs[0].id,
        data: { featuredImage: mediaIdByKey["municipal-manager-portrait"] },
      })
      console.log("Municipal Update post: featuredImage linked.")
    } else {
      console.log("WARNING: diani-municipality-manager-update post not found.")
    }

    console.log("Media seed complete.")
  } catch (err) {
    console.error("Seed script failed:", err)
    process.exitCode = 1
  }
}

await run()
