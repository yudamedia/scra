import type { PayloadRequest } from 'payload'
import type { Membership, Payment } from '../payload-types'

import { auth } from './auth'
import { sendPaymentConfirmedEmail } from './email'

type Contact = {
  surname: string
  firstName?: string | null
  email?: string | null
}

type LinkedAuthUser = NonNullable<Membership['linkedAuthUsers']>[number]

const MS_PER_DAY = 86_400_000
const ADDITIONAL_MEMBER_LETTERS = 'abcdefghijklmnopqrstuvwxyz'

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * MS_PER_DAY)
}

/**
 * The single account-provisioning path for a membership's portal accounts —
 * called both from activateMembership() below (on payment confirmation) and
 * from the one-off backfill script (src/seed/backfill-portal-accounts.ts), so
 * the two can never drift apart. Every contact (primary + additional
 * members, any membership type) with an email gets a linked, passwordless
 * Better Auth account plus a "set your password" email — but only if the
 * *primary* contact also has an email; a membership whose primary has no
 * email provisions nothing at all, even if an additional member has one.
 *
 * The primary contact's linked entry is tagged with the bare
 * membershipNumber (e.g. "435"); each additional member that gets an
 * account is tagged with that number suffixed -a/-b/-c... in order,
 * assigned only to members who actually receive an account.
 *
 * Idempotent: contacts already present in `membership.linkedAuthUsers` (by
 * lowercased email) are skipped, so re-running against an already-linked
 * membership is a no-op for them.
 */
export async function provisionPortalAccounts(membership: Membership): Promise<LinkedAuthUser[]> {
  const linkedAuthUsers: LinkedAuthUser[] = [...(membership.linkedAuthUsers ?? [])]

  const primaryEmail = membership.primaryContact.email?.trim()
  if (!primaryEmail) return linkedAuthUsers

  const membershipNumber = membership.membershipNumber ?? ''
  const contacts: { contact: Contact; memberNumber: string }[] = [
    { contact: membership.primaryContact, memberNumber: membershipNumber },
  ]
  let letterIndex = 0
  for (const additionalMember of membership.additionalMembers ?? []) {
    if (!additionalMember.email?.trim()) continue
    const letter = ADDITIONAL_MEMBER_LETTERS[letterIndex] ?? `x${letterIndex}`
    letterIndex += 1
    contacts.push({ contact: additionalMember, memberNumber: `${membershipNumber}-${letter}` })
  }

  const existingEmails = new Set(linkedAuthUsers.map((u) => u.email.toLowerCase()))

  for (const { contact, memberNumber } of contacts) {
    const email = contact.email?.trim().toLowerCase()
    if (!email || existingEmails.has(email)) continue

    try {
      const created = await auth.api.createUser({
        body: {
          email,
          name: `${contact.firstName ?? ''} ${contact.surname}`.trim(),
        },
      })
      linkedAuthUsers.push({ authUserId: created.user.id, email, memberNumber })
      existingEmails.add(email)

      await auth.api.requestPasswordReset({
        body: { email, redirectTo: '/portal/reset-password' },
      })
    } catch (err) {
      // Known limitation: an email already registered under a different
      // membership isn't linked here. Logged for secretariat
      // follow-up rather than failing the whole activation.
      console.error(`[membership-activation] failed to provision portal account for ${email}:`, err)
    }
  }

  return linkedAuthUsers
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

  const primaryEmail = membership.primaryContact.email?.trim()
  if (primaryEmail) {
    await sendPaymentConfirmedEmail(primaryEmail, {
      name: `${membership.primaryContact.firstName ?? ''} ${membership.primaryContact.surname}`.trim(),
      membershipNumber: membership.membershipNumber ?? '',
      type: membership.type,
      amount: payment.amount,
      expiryDate: newExpiryDate,
      paymentType: payment.paymentType,
    }).catch((err) => console.error('[email] payment confirmed notification failed:', err))
  }

  const linkedAuthUsers = await provisionPortalAccounts(membership)

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
