import type { Access } from 'payload'
import type { User } from '@/payload-types'

// Every collection (except `users` itself, which is superAdmin-only — see Users.ts)
// and every Site Content global, available to grant on a per-admin basis.
export const PERMISSION_RESOURCES = [
  { slug: 'media', label: 'Media', group: 'Collections' },
  { slug: 'documents', label: 'Documents', group: 'Collections' },
  { slug: 'areas', label: 'Areas', group: 'Collections' },
  { slug: 'issues', label: 'Issues', group: 'Collections' },
  { slug: 'directory-entries', label: 'Directory Entries', group: 'Collections' },
  { slug: 'committees', label: 'Committees', group: 'Collections' },
  { slug: 'people', label: 'People', group: 'Collections' },
  { slug: 'posts', label: 'Posts', group: 'Collections' },
  { slug: 'events', label: 'Events', group: 'Collections' },
  { slug: 'memberships', label: 'Memberships', group: 'Collections' },
  { slug: 'payments', label: 'Payments', group: 'Collections' },
  { slug: 'issue-reports', label: 'Issue Reports', group: 'Collections' },
  { slug: 'site-settings', label: 'Site Settings', group: 'Site Content' },
  { slug: 'main-navigation', label: 'Main Navigation', group: 'Site Content' },
  { slug: 'issue-categories', label: 'Issue Categories', group: 'Site Content' },
  { slug: 'homepage', label: 'Homepage', group: 'Site Content' },
  { slug: 'about-page', label: 'About Page', group: 'Site Content' },
  { slug: 'membership-page', label: 'Membership Page', group: 'Site Content' },
  { slug: 'page-intros', label: 'Page Intros', group: 'Site Content' },
  { slug: 'legal-pages', label: 'Legal Pages', group: 'Site Content' },
] as const

export type ResourceSlug = (typeof PERMISSION_RESOURCES)[number]['slug']
export type PermissionAction = 'read' | 'create' | 'update' | 'delete'

export const PERMISSION_RESOURCE_OPTIONS = PERMISSION_RESOURCES.map(({ slug, label, group }) => ({
  label: `${label} (${group})`,
  value: slug,
}))

function hasPermission(
  user: User | null | undefined,
  resource: ResourceSlug,
  action: PermissionAction,
): boolean {
  if (!user) return false
  if (user.role === 'superAdmin') return true
  const entry = user.permissions?.find((p) => p.resource === resource)
  return Boolean(entry?.[action])
}

/** `create`/`update`/`delete` on collections, `update` on globals. */
export function canManage(resource: ResourceSlug, action: PermissionAction): Access {
  return ({ req }) => hasPermission(req.user, resource, action)
}

/**
 * `read` for collections/globals: stays public for anonymous requests (the public
 * site and unauthenticated REST/GraphQL calls), so the frontend is unaffected; for a
 * logged-in Payload admin, defers to their permission matrix so their admin sidebar
 * only shows what they're actually granted.
 */
export function publicReadOrManage(resource: ResourceSlug): Access {
  return ({ req }) => {
    if (!req.user) return true
    return hasPermission(req.user, resource, 'read')
  }
}
