import { getPayload } from 'payload'
import config from '@payload-config'
import { areasData } from './areas-data'
import { toLexicalRichText } from './lexical'

console.log('Seed script starting...')

async function run() {
  try {
    const payload = await getPayload({ config })
    console.log('Payload initialized.')

    for (const area of areasData) {
      const existing = await payload.find({
        collection: 'areas',
        where: { slug: { equals: area.slug } },
        limit: 1,
      })

      const data = {
        name: area.name,
        slug: area.slug,
        overview: toLexicalRichText(area.overview),
      }

      if (existing.docs.length > 0) {
        await payload.update({
          collection: 'areas',
          id: existing.docs[0].id,
          data,
        })
        console.log(`Updated: ${area.name}`)
      } else {
        await payload.create({
          collection: 'areas',
          data,
        })
        console.log(`Created: ${area.name}`)
      }
    }

    console.log('Seed complete.')
  } catch (err) {
    console.error('Seed script failed:', err)
    process.exitCode = 1
  }
}

await run()
