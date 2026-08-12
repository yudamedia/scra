import { formatLabel, directoryCategoryLabels } from '@/lib/format'
import type { Area, DirectoryEntry, Issue } from '@/payload-types'

export type MapCategory =
  | 'road-projects'
  | 'environmental-areas'
  | 'healthcare'
  | 'schools'
  | 'community-facilities'

export const mapCategoryLabels: Record<MapCategory, string> = {
  'road-projects': 'Road Projects',
  'environmental-areas': 'Environmental Areas',
  healthcare: 'Healthcare',
  schools: 'Schools',
  'community-facilities': 'Community Facilities',
}

// Literal hex values matching the site's existing design tokens
// (src/app/(frontend)/globals.css: --secondary, --brand-green, --destructive,
// --lagoon, --primary) rather than inventing a new palette for the map
// legend. Kept literal (not var()) since these are also used inside
// server-rendered SVG strings for Leaflet's divIcon markers.
export const mapCategoryColors: Record<MapCategory, string> = {
  'road-projects': '#0077C8',
  'environmental-areas': '#139A3D',
  healthcare: '#DC2626',
  schools: '#27C5C3',
  'community-facilities': '#0D2B5B',
}

const ISSUE_CATEGORY_MAP: Partial<Record<string, MapCategory>> = {
  'roads-infrastructure': 'road-projects',
  environment: 'environmental-areas',
  'beach-access': 'environmental-areas',
}

const DIRECTORY_CATEGORY_MAP: Partial<Record<string, MapCategory>> = {
  hospitals: 'healthcare',
  schools: 'schools',
}

function issueMapCategory(category: string): MapCategory {
  return ISSUE_CATEGORY_MAP[category] ?? 'community-facilities'
}

function directoryMapCategory(category: string): MapCategory {
  return DIRECTORY_CATEGORY_MAP[category] ?? 'community-facilities'
}

export type MapMarker = {
  id: string
  type: 'issue' | 'directory-entry'
  category: MapCategory
  title: string
  subtitle: string
  lat: number
  lng: number
  href?: string
}

type LatLng = { lat?: number | null; lng?: number | null } | null | undefined

function resolveLatLng(own: LatLng, fallback: LatLng): { lat: number; lng: number } | null {
  if (typeof own?.lat === 'number' && typeof own?.lng === 'number') {
    return { lat: own.lat, lng: own.lng }
  }
  if (typeof fallback?.lat === 'number' && typeof fallback?.lng === 'number') {
    return { lat: fallback.lat, lng: fallback.lng }
  }
  return null
}

function relatedArea(area: Area | number | null | undefined): Area | undefined {
  if (area && typeof area === 'object') return area
  return undefined
}

export function getMapMarkers({
  issues,
  directoryEntries,
}: {
  issues: Issue[]
  directoryEntries: DirectoryEntry[]
}): MapMarker[] {
  const markers: MapMarker[] = []

  for (const issue of issues) {
    const area = relatedArea(issue.area)
    const coords = resolveLatLng(issue.location, area?.location)
    if (!coords) continue
    markers.push({
      id: `issue-${issue.id}`,
      type: 'issue',
      category: issueMapCategory(issue.category),
      title: issue.title,
      subtitle: formatLabel(issue.category),
      href: `/issues/${issue.slug}`,
      ...coords,
    })
  }

  for (const entry of directoryEntries) {
    const area = relatedArea(entry.area)
    const coords = resolveLatLng(entry.location, area?.location)
    if (!coords) continue
    markers.push({
      id: `directory-entry-${entry.id}`,
      type: 'directory-entry',
      category: directoryMapCategory(entry.category),
      title: entry.name,
      subtitle: directoryCategoryLabels[entry.category] ?? formatLabel(entry.category),
      ...coords,
    })
  }

  return markers
}
