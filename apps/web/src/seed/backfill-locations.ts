import { getPayload } from 'payload'
import config from '@payload-config'
import { geocodeAddress } from '@/lib/geocode'

// Nominatim's usage policy caps requests at 1/sec — this only matters for
// this one-time bulk pass, not the low-frequency per-save collection hooks.
const THROTTLE_MS = 1100

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function hasCoords(doc: { location?: { lat?: number | null; lng?: number | null } | null }) {
  return typeof doc.location?.lat === 'number' && typeof doc.location?.lng === 'number'
}

async function run() {
  try {
    const payload = await getPayload({ config })
    console.log('Payload initialized.')

    // 1. Areas — geocode from name
    const { docs: areas } = await payload.find({ collection: 'areas', limit: 200 })
    for (const area of areas) {
      if (hasCoords(area)) {
        console.log(`Skipping area "${area.name}" — already has coordinates.`)
        continue
      }
      const coords = await geocodeAddress(`${area.name}, Kenya`)
      if (coords) {
        await payload.update({ collection: 'areas', id: area.id, data: { location: coords } })
        console.log(`Geocoded area "${area.name}" -> ${coords.lat}, ${coords.lng}`)
      } else {
        console.log(`Could not geocode area "${area.name}" — left blank.`)
      }
      await sleep(THROTTLE_MS)
    }

    // 2. Directory entries — geocode from address
    const { docs: entries } = await payload.find({ collection: 'directory-entries', limit: 500 })
    for (const entry of entries) {
      if (hasCoords(entry)) {
        console.log(`Skipping directory entry "${entry.name}" — already has coordinates.`)
        continue
      }
      if (!entry.address?.trim()) {
        console.log(`Skipping directory entry "${entry.name}" — no address to geocode.`)
        continue
      }
      const coords = await geocodeAddress(entry.address)
      if (coords) {
        await payload.update({ collection: 'directory-entries', id: entry.id, data: { location: coords } })
        console.log(`Geocoded directory entry "${entry.name}" -> ${coords.lat}, ${coords.lng}`)
      } else {
        console.log(`Could not geocode directory entry "${entry.name}" (${entry.address}) — left blank.`)
      }
      await sleep(THROTTLE_MS)
    }

    // 3. Issues — geocode from locationText (most issues won't have one; that's expected, they fall back to their area's location on the map)
    const { docs: issues } = await payload.find({ collection: 'issues', limit: 500 })
    for (const issue of issues) {
      if (hasCoords(issue)) {
        console.log(`Skipping issue "${issue.title}" — already has coordinates.`)
        continue
      }
      if (!issue.locationText?.trim()) {
        console.log(`Skipping issue "${issue.title}" — no locationText set, will fall back to its area.`)
        continue
      }
      const coords = await geocodeAddress(issue.locationText)
      if (coords) {
        await payload.update({ collection: 'issues', id: issue.id, data: { location: coords } })
        console.log(`Geocoded issue "${issue.title}" -> ${coords.lat}, ${coords.lng}`)
      } else {
        console.log(`Could not geocode issue "${issue.title}" (${issue.locationText}) — left blank.`)
      }
      await sleep(THROTTLE_MS)
    }

    console.log('Location backfill complete.')
  } catch (err) {
    console.error('Seed script failed:', err)
    process.exitCode = 1
  }
}

await run()
