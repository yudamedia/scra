import { getPayload } from 'payload'
import config from '../payload.config'
import { areasData } from './areas-data'
import { toLexicalRichText } from './lexical'

async function run() {
  const payload = await getPayload({ config })

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
      payload.logger.info(`Updated: ${area.name}`)
    } else {
      await payload.create({
        collection: 'areas',
        data,
      })
      payload.logger.info(`Created: ${area.name}`)
    }
  }

  payload.logger.info('Seed complete.')
  process.exit(0)
}

run()
