import { getPayload } from 'payload'
import config from '@payload-config'
import { peopleDataV2, staleNames } from './people-data-v2'
import { toLexicalRichText } from './lexical'

async function run() {
  try {
    const payload = await getPayload({ config })
    console.log('Payload initialized.')

    // 1. Remove stale people not in the current official roster
    for (const name of staleNames) {
      const existing = await payload.find({
        collection: 'people',
        where: { name: { equals: name } },
        limit: 1,
      })
      if (existing.docs.length > 0) {
        await payload.delete({ collection: 'people', id: existing.docs[0].id })
        console.log(`Removed stale record: ${name}`)
      }
    }

    // 2. Ensure an Executive Committee record exists
    const existingCommittee = await payload.find({
      collection: 'committees',
      where: { name: { equals: 'Executive Committee' } },
      limit: 1,
    })
    let committeeId: number
    if (existingCommittee.docs.length > 0) {
      committeeId = existingCommittee.docs[0].id
      console.log('Executive Committee already exists.')
    } else {
      const created = await payload.create({
        collection: 'committees',
        data: {
          name: 'Executive Committee',
          description: toLexicalRichText(
            "SCRA's governing committee, responsible for leading the Association and representing the interests of South Coast residents and property owners in engagement with government, businesses, and the wider community.",
          ),
        },
      })
      committeeId = created.id
      console.log('Executive Committee created.')
    }

    // 3. Upsert the real roster
    for (const person of peopleDataV2) {
      const existing = await payload.find({
        collection: 'people',
        where: { name: { equals: person.name } },
        limit: 1,
      })
      const data = {
        name: person.name,
        role: person.role,
        committee: committeeId,
        bio: person.bio ? toLexicalRichText(person.bio) : undefined,
      }
      if (existing.docs.length > 0) {
        await payload.update({ collection: 'people', id: existing.docs[0].id, data })
        console.log(`Updated: ${person.name} — ${person.role}`)
      } else {
        await payload.create({ collection: 'people', data })
        console.log(`Created: ${person.name} — ${person.role}`)
      }
    }

    console.log('People roster update complete.')
  } catch (err) {
    console.error('Seed script failed:', err)
    process.exitCode = 1
  }
}

await run()
