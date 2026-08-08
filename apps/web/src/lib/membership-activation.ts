import type { PayloadRequest } from 'payload'
import type { Payment } from '../payload-types'

import { auth } from './auth'

type Contact = {
  surname: string
  firstName?: string | null
  email?: string | null
}

const MS_PER_DAY = 86_400_000

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * MS_PER_DAY)
}

/**
 * The single activation path for a confirmed payment, called only from
 * Payments.ts's afterChange hook — reached identically whether the payment
 * was confirmed by the Tuma webhook or by a secretariat member editing the
 * record in the admin panel, so the two paths can never drift apart.
 *
 * Takes the already-written `payment` doc (not a ref to re-fetch) and the
 * hook's `req` — a payment confirmed in the same create call it was made in
 * (rather than created pending, then updated) is still inside that create's
 * DB transaction, so a fresh `findByID` without `req` can 404 on a row that
 * hasn't committed yet. Passing `req` through keeps every read/write here in
 * that same transaction.
 */
export async function activateMembership({ payment, req }: { payment: Payment; req: PayloadRequest }) {
  const payload = req.payload
  const membershipId = typeof payment.membership === 'object' ? payment.membership.id : payment.membership
  const membership = await payload.findByID({ collection: 'memberships', id: membershipId, depth: 0, req })

  const confirmedAt = payment.confirmedAt ? new Date(payment.confirmedAt) : new Date()
  const newExpiryDate = addDays(confirmedAt, 365).toISOString()

  const contacts: Contact[] =
    membership.type === 'corporate'
      ? [membership.primaryContact, ...(membership.additionalMembers ?? [])].slice(0, 4)
      : [membership.primaryContact]

  const existingEmails = new Set((membership.linkedAuthUsers ?? []).map((u) => u.email.toLowerCase()))
  const linkedAuthUsers = [...(membership.linkedAuthUsers ?? [])]

  for (const contact of contacts) {
    const email = contact.email?.trim().toLowerCase()
    if (!email || existingEmails.has(email)) continue

    try {
      const created = await auth.api.createUser({
        body: {
          email,
          name: `${contact.firstName} ${contact.surname}`.trim(),
        },
      })
      linkedAuthUsers.push({ authUserId: created.user.id, email })
      existingEmails.add(email)

      await auth.api.signInMagicLink({
        body: { email, callbackURL: '/portal' },
        headers: new Headers(),
      })
    } catch (err) {
      // Known limitation: an email already registered under a different
      // membership record isn't linked here. Logged for secretariat
      // follow-up rather than failing the whole activation.
      console.error(`[membership-activation] failed to provision portal account for ${email}:`, err)
    }
  }

  await payload.update({
    collection: 'memberships',
    id: membershipId,
    data: {
      expiryDate: newExpiryDate,
      linkedAuthUsers,
    },
    req,
  })
}
