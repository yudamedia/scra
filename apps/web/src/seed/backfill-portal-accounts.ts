import { getPayload } from 'payload'
import config from '@payload-config'
import { provisionPortalAccounts } from '@/lib/membership-activation'

// Resend's default rate limit — this is a one-time bulk pass, not the
// low-frequency per-activation call this logic normally runs through.
const THROTTLE_MS = 600

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function run() {
  try {
    const payload = await getPayload({ config })
    console.log('Payload initialized.')

    if (!process.env.RESEND_API_KEY) {
      console.log(
        'RESEND_API_KEY is not set — set-password emails will be logged to the console rather than sent. ' +
          'Verify the summary below looks right before ever running this against a live key.',
      )
    }

    const { docs: memberships } = await payload.find({ collection: 'memberships', limit: 0 })
    console.log(`Found ${memberships.length} membership records.`)

    let created = 0
    let alreadyLinked = 0
    const skippedNoPrimaryEmail: string[] = []
    const errors: string[] = []

    for (const membership of memberships) {
      const primaryEmail = membership.primaryContact.email?.trim()
      const hasEligibleAdditional = (membership.additionalMembers ?? []).some((m) => m.email?.trim())

      if (!primaryEmail) {
        if (hasEligibleAdditional) {
          skippedNoPrimaryEmail.push(membership.membershipNumber ?? `id ${membership.id}`)
        }
        continue
      }

      const before = membership.linkedAuthUsers ?? []
      const beforeEmails = new Set(before.map((u) => u.email.toLowerCase()))

      let linkedAuthUsers
      try {
        linkedAuthUsers = await provisionPortalAccounts(membership)
      } catch (err) {
        errors.push(`${membership.membershipNumber ?? membership.id}: ${err}`)
        continue
      }

      const newEntries = linkedAuthUsers.filter((u) => !beforeEmails.has(u.email.toLowerCase()))
      alreadyLinked += before.length

      if (newEntries.length === 0) continue

      await payload.update({
        collection: 'memberships',
        id: membership.id,
        data: { linkedAuthUsers },
      })

      for (const entry of newEntries) {
        console.log(`Created portal account ${entry.memberNumber} (${entry.email})`)
      }
      created += newEntries.length

      await sleep(THROTTLE_MS)
    }

    console.log('\n--- Backfill summary ---')
    console.log(`Accounts created: ${created}`)
    console.log(`Already linked (skipped): ${alreadyLinked}`)
    console.log(`Skipped — additional member has an email but primary doesn't: ${skippedNoPrimaryEmail.length}`)
    if (skippedNoPrimaryEmail.length) {
      console.log(`  Membership numbers: ${skippedNoPrimaryEmail.join(', ')}`)
    }
    if (errors.length) {
      console.log(`Errors: ${errors.length}`)
      errors.forEach((e) => console.log(`  ${e}`))
    }
    console.log('Backfill complete.')
  } catch (err) {
    console.error('Seed script failed:', err)
    process.exitCode = 1
  }
}

await run()
