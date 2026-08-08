import type { Payload } from 'payload'

export type DueReminderStage = '30day' | '7day' | 'dueday' | 'lapsed'
export type ReminderStage = 'none' | DueReminderStage

type MembershipLike = {
  adminRevoked?: boolean | null
  expiryDate?: string | null
}

function startOfToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

export const subscriptionAmountForType: Record<string, number> = {
  personal: 3000,
  household: 5000,
  corporate: 10000,
  free: 0,
}

export function isMembershipActive(membership: MembershipLike): boolean {
  if (membership.adminRevoked) return false
  if (!membership.expiryDate) return false
  return new Date(membership.expiryDate) >= startOfToday()
}

/**
 * Legacy numbers are zero-padded strings ("003", "099", "459"). New numbers
 * continue the same numeric sequence, padded to at least 3 digits and wider
 * automatically once the sequence exceeds 999.
 */
export async function getNextMembershipNumber(payload: Payload): Promise<string> {
  const { docs } = await payload.find({
    collection: 'memberships',
    limit: 0,
    depth: 0,
    select: { membershipNumber: true },
  })

  let max = 0
  for (const doc of docs) {
    const value = doc.membershipNumber
    if (!value) continue
    const parsed = parseInt(value, 10)
    if (!Number.isNaN(parsed) && parsed > max) max = parsed
  }

  const next = max + 1
  const width = Math.max(3, String(next).length)
  return String(next).padStart(width, '0')
}

/**
 * Daily-cron-friendly: returns the reminder stage due today for a given
 * expiry date, or null if none is due. The cron compares this against
 * `lastReminderStage` before sending, so a re-run the same day is a no-op.
 */
export function computeReminderStage(expiryDate: Date, today: Date = startOfToday()): DueReminderStage | null {
  const expiry = new Date(expiryDate)
  expiry.setHours(0, 0, 0, 0)
  const diffDays = Math.round((expiry.getTime() - today.getTime()) / 86_400_000)

  if (diffDays === 30) return '30day'
  if (diffDays === 7) return '7day'
  if (diffDays === 0) return 'dueday'
  if (diffDays < 0) return 'lapsed'
  return null
}
