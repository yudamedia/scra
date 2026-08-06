import { getPayload } from "payload"
import config from "@payload-config"

async function run() {
  try {
    const payload = await getPayload({ config })
    console.log("Payload initialized.")

    const media = await payload.find({
      collection: "media",
      where: { filename: { equals: "george-mokaya.jpg" } },
      limit: 1,
    })
    if (!media.docs[0]) {
      console.log("WARNING: george-mokaya.jpg not found in media collection.")
      return
    }

    const person = await payload.find({
      collection: "people",
      where: { name: { equals: "George Mokaya Swanya" } },
      limit: 1,
    })
    if (!person.docs[0]) {
      console.log("WARNING: George Mokaya Swanya not found in people collection.")
      return
    }

    await payload.update({
      collection: "people",
      id: person.docs[0].id,
      data: { photo: media.docs[0].id },
    })
    console.log("George Mokaya's photo linked.")
  } catch (err) {
    console.error("Seed script failed:", err)
    process.exitCode = 1
  }
}

await run()
