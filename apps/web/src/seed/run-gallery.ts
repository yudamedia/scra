import { getPayload } from "payload"
import config from "@payload-config"

async function run() {
  try {
    const payload = await getPayload({ config })
    console.log("Payload initialized.")

    const galleryKeys = [
      { key: "lotfa-junction-accident-1.jpg", caption: "Overturned vehicle in a ditch beside the road" },
      { key: "lotfa-junction-accident-2.jpg", caption: "Ambulance and motorbike at the scene of an accident" },
      { key: "lotfa-junction-accident-3.jpg", caption: "SUV damaged in a night-time accident at the junction" },
      { key: "lotfa-junction-wall-annotated.jpg", caption: "The visibility-obstructing wall, highlighted" },
    ]

    const mediaIds: Record<string, number> = {}
    for (const item of galleryKeys) {
      const filenameMatch = await payload.find({
        collection: "media",
        where: { filename: { equals: item.key } },
        limit: 1,
      })
      if (!filenameMatch.docs[0]) {
        console.log(`WARNING: media not found for filename ${item.key}`)
        continue
      }
      mediaIds[item.key] = filenameMatch.docs[0].id as number
    }

    const issue = await payload.find({
      collection: "issues",
      where: { slug: { equals: "lotfa-junction-visibility" } },
      limit: 1,
    })
    if (!issue.docs[0]) {
      console.log("WARNING: lotfa-junction-visibility issue not found.")
      return
    }

    const gallery = galleryKeys
      .filter((item) => mediaIds[item.key])
      .map((item) => ({
        image: mediaIds[item.key],
        caption: item.caption,
      }))

    await payload.update({
      collection: "issues",
      id: issue.docs[0].id,
      data: { gallery },
    })
    console.log(`Gallery updated with ${gallery.length} photos.`)
    console.log("Gallery seed complete.")
  } catch (err) {
    console.error("Seed script failed:", err)
    process.exitCode = 1
  }
}

await run()
