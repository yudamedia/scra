import { getPayload } from 'payload'
import config from '@payload-config'
import { peopleData } from './people-data'
import { postsData2 } from './posts-data-2'
import { issuesData2 } from './issues-data-2'
import { toLexicalRichText } from './lexical'

async function run() {
  try {
    const payload = await getPayload({ config })
    console.log('Payload initialized.')

    for (const item of peopleData) {
      const existing = await payload.find({
        collection: 'people',
        where: { name: { equals: item.name } },
        limit: 1,
      })
      const data = {
        name: item.name,
        role: item.role,
        bio: toLexicalRichText(item.bio),
      }
      if (existing.docs.length > 0) {
        await payload.update({ collection: 'people', id: existing.docs[0].id, data })
        console.log(`Person updated: ${item.name}`)
      } else {
        await payload.create({ collection: 'people', data })
        console.log(`Person created: ${item.name}`)
      }
    }

    for (const item of postsData2) {
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

    for (const item of issuesData2) {
      const existing = await payload.find({
        collection: 'issues',
        where: { slug: { equals: item.slug } },
        limit: 1,
      })

      let areaId: number | undefined
      if (item.area) {
        const areaMatch = await payload.find({
          collection: 'areas',
          where: { slug: { equals: item.area } },
          limit: 1,
        })
        areaId = areaMatch.docs[0]?.id
      }

      const data = {
        title: item.title,
        slug: item.slug,
        category: item.category,
        status: item.status,
        area: areaId,
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

    console.log('Content seed 2 complete.')
  } catch (err) {
    console.error('Seed script failed:', err)
    process.exitCode = 1
  }
}

await run()
