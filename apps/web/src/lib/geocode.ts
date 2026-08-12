const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'
const USER_AGENT = 'SCRA Website (South Coast Residents Association, contact: yudamedia@gmail.com)'

export type LatLng = { lat: number; lng: number }

/**
 * Best-effort geocode via Nominatim (OSM). Never throws — a geocoding
 * hiccup should never block a Payload save, so callers just get `null`
 * back on any failure or no-match.
 */
export async function geocodeAddress(query: string): Promise<LatLng | null> {
  const trimmed = query.trim()
  if (!trimmed) return null

  try {
    const url = new URL(NOMINATIM_URL)
    url.searchParams.set('q', trimmed)
    url.searchParams.set('format', 'json')
    url.searchParams.set('limit', '1')

    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
    })
    if (!res.ok) return null

    const results = (await res.json()) as Array<{ lat: string; lon: string }>
    const first = results[0]
    if (!first) return null

    const lat = parseFloat(first.lat)
    const lng = parseFloat(first.lon)
    if (Number.isNaN(lat) || Number.isNaN(lng)) return null

    return { lat, lng }
  } catch (err) {
    console.error('[geocode] Nominatim lookup failed:', err)
    return null
  }
}

type LocationLike = { lat?: number | null; lng?: number | null } | null | undefined

/**
 * Shared beforeChange-hook helper: only fills in `data.location` when both
 * lat/lng are currently empty, so a manually-corrected pin is never
 * overwritten by a later save.
 */
export async function applyGeocodeHook(
  data: { location?: LocationLike },
  { sourceText }: { sourceText: string | null | undefined },
): Promise<void> {
  const hasCoords = typeof data.location?.lat === 'number' && typeof data.location?.lng === 'number'
  if (hasCoords) return
  if (!sourceText?.trim()) return

  const coords = await geocodeAddress(sourceText)
  if (coords) {
    data.location = coords
  }
}
