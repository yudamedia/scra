import { headers } from 'next/headers'
import type { Membership } from '../payload-types'

import { auth } from './auth'
import { getPayloadClient } from './payload'

// Better Auth's fully-inferred session type collapses to `never` once enough
// plugins (admin + magicLink) stack up — narrowed to the shape this app
// actually consumes rather than fighting that inference, and pinned via an
// explicit return type so that inference issue can't leak into callers.
type PortalAuthSession = { user: { id: string; email: string } }

export async function getPortalSession(): Promise<{
  session: PortalAuthSession | null
  membership: Membership | null
}> {
  const session = (await auth.api.getSession({
    headers: await headers(),
  })) as PortalAuthSession | null
  if (!session) return { session: null, membership: null }

  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'memberships',
    where: { 'linkedAuthUsers.authUserId': { equals: session.user.id } },
    limit: 1,
  })

  return { session, membership: docs[0] ?? null }
}
