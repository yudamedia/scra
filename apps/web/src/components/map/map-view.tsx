'use client'

import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import type { MapCategory, MapMarker } from '@/lib/map-categories'
import { mapCategoryColors, mapCategoryLabels } from '@/lib/map-categories'

const LeafletMap = dynamic(() => import('./leaflet-map'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-muted">
      <p className="text-sm text-muted-foreground">Loading map…</p>
    </div>
  ),
})

const ALL_CATEGORIES = Object.keys(mapCategoryLabels) as MapCategory[]

export default function MapView({
  markers,
  preview = false,
}: {
  markers: MapMarker[]
  preview?: boolean
}) {
  const [activeCategories, setActiveCategories] = useState<Set<MapCategory>>(new Set(ALL_CATEGORIES))

  const filtered = useMemo(
    () => markers.filter((marker) => activeCategories.has(marker.category)),
    [markers, activeCategories],
  )

  function toggleCategory(category: MapCategory) {
    setActiveCategories((prev) => {
      const next = new Set(prev)
      if (next.has(category)) {
        next.delete(category)
      } else {
        next.add(category)
      }
      return next
    })
  }

  return (
    <div className={preview ? 'flex flex-col gap-3' : 'flex flex-col gap-4 md:flex-row md:gap-6'}>
      {!preview && (
        <div className="shrink-0 md:w-56">
          <p className="text-sm font-semibold text-primary mb-3">Legend</p>
          <div className="flex flex-wrap gap-2 md:flex-col md:gap-2">
            {ALL_CATEGORIES.map((category) => {
              const active = activeCategories.has(category)
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm text-left transition-opacity ${
                    active ? 'opacity-100' : 'opacity-40'
                  } bg-card shadow-sm hover:opacity-100`}
                >
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: mapCategoryColors[category] }}
                  />
                  <span className="text-primary font-medium">{mapCategoryLabels[category]}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
      <div className={preview ? 'h-[300px] w-full overflow-hidden rounded-lg shadow-sm' : 'h-[500px] w-full overflow-hidden rounded-lg shadow-sm md:h-[600px]'}>
        <LeafletMap markers={filtered} preview={preview} />
      </div>
    </div>
  )
}
