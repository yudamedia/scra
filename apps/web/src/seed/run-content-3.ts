import path from "path"
import { fileURLToPath } from "url"
import { getPayload } from "payload"
import config from "@payload-config"
import { documentsData } from "./documents-data"
import { newIssues, issueUpdates } from "./issues-data-3"
import { postsData3 } from "./posts-data-3"
import { directoryData2 } from "./directory-data-2"
import { toLexicalRichText } from "./lexical"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function run() {
  try {
    const payload = await getPayload({ config })
    console.log("Payload initialized.")

    // 1. Upload documents, build key -> id map
    const docIdByKey: Record<string, number> = {}
    for (const doc of documentsData) {
      const existing = await payload.find({
        collection: "documents",
        where: { title: { equals: doc.title } },
        limit: 1,
      })
      if (existing.docs.length > 0) {
        docIdByKey[doc.key] = existing.docs[0].id as number
        console.log(`Document already exists: ${doc.title}`)
        continue
      }
      const filePath = path.resolve(__dirname, "source-pdfs", doc.filename)
      const created = await payload.create({
        collection: "documents",
        data: {
          title: doc.title,
          category: doc.category,
          summary: doc.summary,
          publishedDate: doc.publishedDate,
        },
        filePath,
      })
      docIdByKey[doc.key] = created.id as number
      console.log(`Document uploaded: ${doc.title}`)
    }

    // 2. New directory entries
    for (const entry of directoryData2) {
      const existing = await payload.find({
        collection: "directory-entries",
        where: { name: { equals: entry.name } },
        limit: 1,
      })
      if (existing.docs.length > 0) {
        console.log(`Directory entry already exists: ${entry.name}`)
        continue
      }
      await payload.create({ collection: "directory-entries", data: entry })
      console.log(`Directory entry created: ${entry.name}`)
    }

    // 3. New issues
    for (const issue of newIssues) {
      const existing = await payload.find({
        collection: "issues",
        where: { slug: { equals: issue.slug } },
        limit: 1,
      })
      let areaId: number | undefined
      if (issue.area) {
        const areaMatch = await payload.find({
          collection: "areas",
          where: { slug: { equals: issue.area } },
          limit: 1,
        })
        areaId = areaMatch.docs[0]?.id as number | undefined
      }
      const data = {
        title: issue.title,
        slug: issue.slug,
        category: issue.category,
        status: issue.status,
        area: areaId,
        background: toLexicalRichText(issue.background),
        actionsUndertaken: issue.actionsUndertaken
          ? toLexicalRichText(issue.actionsUndertaken)
          : undefined,
        progressUpdates: issue.progressUpdates,
        supportingDocuments: issue.supportingDocuments.map((key) => docIdByKey[key]),
      }
      if (existing.docs.length > 0) {
        await payload.update({ collection: "issues", id: existing.docs[0].id, data })
        console.log(`Issue updated: ${issue.title}`)
      } else {
        await payload.create({ collection: "issues", data })
        console.log(`Issue created: ${issue.title}`)
      }
    }

    // 4. New posts (need these created before issue updates that link relatedNews)
    const postIdBySlug: Record<string, number> = {}
    for (const post of postsData3) {
      const existing = await payload.find({
        collection: "posts",
        where: { slug: { equals: post.slug } },
        limit: 1,
      })
      const data = {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: toLexicalRichText(post.content),
        publishedDate: post.publishedDate,
      }
      if (existing.docs.length > 0) {
        postIdBySlug[post.slug] = existing.docs[0].id as number
        await payload.update({ collection: "posts", id: existing.docs[0].id, data })
        console.log(`Post updated: ${post.title}`)
      } else {
        const created = await payload.create({ collection: "posts", data })
        postIdBySlug[post.slug] = created.id as number
        console.log(`Post created: ${post.title}`)
      }
    }

    // 5. Existing issue updates (merge, don't overwrite arrays)
    for (const update of issueUpdates) {
      const existing = await payload.find({
        collection: "issues",
        where: { slug: { equals: update.slug } },
        limit: 1,
        depth: 0,
      })
      const current = existing.docs[0]
      if (!current) {
        console.log(`WARNING: could not find issue to update: ${update.slug}`)
        continue
      }

      const existingProgress = Array.isArray(current.progressUpdates)
        ? current.progressUpdates
        : []
      const existingDocs = Array.isArray(current.supportingDocuments)
        ? (current.supportingDocuments as number[])
        : []
      const existingRelatedNews = Array.isArray(current.relatedNews)
        ? (current.relatedNews as number[])
        : []

      const newDocIds = (update.addSupportingDocuments ?? []).map((key) => docIdByKey[key])
      const newRelatedNewsIds = update.addRelatedNewsSlug
        ? [postIdBySlug[update.addRelatedNewsSlug]]
        : []

      await payload.update({
        collection: "issues",
        id: current.id,
        data: {
          status: update.setStatus ?? current.status,
          progressUpdates: [...existingProgress, ...update.addProgressUpdates],
          supportingDocuments: [...new Set([...existingDocs, ...newDocIds])],
          relatedNews: [...new Set([...existingRelatedNews, ...newRelatedNewsIds])],
        },
      })
      console.log(`Issue updated (merge): ${update.slug}`)
    }

    console.log("Content seed 3 complete.")
  } catch (err) {
    console.error("Seed script failed:", err)
    process.exitCode = 1
  }
}

await run()
