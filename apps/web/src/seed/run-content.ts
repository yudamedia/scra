import { getPayload } from 'payload'
import config from '@payload-config'
import { committeesData } from './committees-data'
import { directoryData } from './directory-data'
import { issuesData } from './issues-data'
import { postsData } from './posts-data'
import { toLexicalRichText } from './lexical'

async function run() {
  try {
    const payload = await getPayload({ config })
    console.log('Payload initialized.')

    // Committees (upsert by name)
    for (const item of committeesData) {
      const existing = await payload.find({
        collection: 'committees',
        where: { name: { equals: item.name } },
        limit: 1,
      })
      const data = {
        name: item.name,
        description: toLexicalRichText(item.description),
      }
      if (existing.docs.length > 0) {
        await payload.update({ collection: 'committees', id: existing.docs[0].id, data })
        console.log(`Committee updated: ${item.name}`)
      } else {
        await payload.create({ collection: 'committees', data })
        console.log(`Committee created: ${item.name}`)
      }
    }

    // Directory Entries (upsert by name)
    for (const item of directoryData) {
      const existing = await payload.find({
        collection: 'directory-entries',
        where: { name: { equals: item.name } },
        limit: 1,
      })
      const data = {
        name: item.name,
        category: item.category,
        description: item.description,
      }
      if (existing.docs.length > 0) {
        await payload.update({ collection: 'directory-entries', id: existing.docs[0].id, data })
        console.log(`Directory entry updated: ${item.name}`)
      } else {
        await payload.create({ collection: 'directory-entries', data })
        console.log(`Directory entry created: ${item.name}`)
      }
    }

    // Issues (upsert by slug)
    for (const item of issuesData) {
      const existing = await payload.find({
        collection: 'issues',
        where: { slug: { equals: item.slug } },
        limit: 1,
      })
      const data = {
        title: item.title,
        slug: item.slug,
        category: item.category,
        status: item.status,
        background: toLexicalRichText(item.background),
        actionsUndertaken: item.actionsUndertaken ? toLexicalRichText(item.actionsUndertaken) : undefined,
        progressUpdates: item.progressUpdates,
      }
      if (existing.docs.length > 0) {
        await payload.update({ collection: 'issues', id: existing.docs[0].id, data })
        console.log(`Issue updated: ${item.title}`)
      } else {
        await payload.create({ collection: 'issues', data })
        console.log(`Issue created: ${item.title}`)
      }
    }

    // Posts (upsert by slug)
    for (const item of postsData) {
      const existing = await payload.find({
        collection: 'posts',
        where: { slug: { equals: item.slug } },
        limit: 1,
      })
      const data = {
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt,
        content: toLexicalRichText(item.content),
        publishedDate: item.publishedDate,
      }
      if (existing.docs.length > 0) {
        await payload.update({ collection: 'posts', id: existing.docs[0].id, data })
        console.log(`Post updated: ${item.title}`)
      } else {
        await payload.create({ collection: 'posts', data })
        console.log(`Post created: ${item.title}`)
      }
    }

    console.log('Content seed complete.')
  } catch (err) {
    console.error('Seed script failed:', err)
    process.exitCode = 1
  }
}

await run()
