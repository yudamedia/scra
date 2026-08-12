'use client'

import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import Link from 'next/link'
import type { MapMarker } from '@/lib/map-categories'
import { mapCategoryColors } from '@/lib/map-categories'

// South Coast Kenya, roughly centered between Likoni and Lunga Lunga.
const DEFAULT_CENTER: [number, number] = [-4.35, 39.5]

function pinIcon(color: string) {
  return L.divIcon({
    className: '',
    html: `<svg width="28" height="38" viewBox="0 0 28 38" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 24 14 24s14-13.5 14-24c0-7.732-6.268-14-14-14z" fill="${color}" stroke="white" stroke-width="1.5"/>
      <circle cx="14" cy="14" r="5" fill="white"/>
    </svg>`,
    iconSize: [28, 38],
    iconAnchor: [14, 38],
    popupAnchor: [0, -34],
  })
}

export default function LeafletMap({
  markers,
  preview = false,
}: {
  markers: MapMarker[]
  preview?: boolean
}) {
  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={preview ? 10 : 11}
      scrollWheelZoom={!preview}
      dragging={!preview}
      zoomControl={!preview}
      doubleClickZoom={!preview}
      touchZoom={!preview}
      attributionControl={!preview}
      className="h-full w-full"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {markers.map((marker) => (
        <Marker key={marker.id} position={[marker.lat, marker.lng]} icon={pinIcon(mapCategoryColors[marker.category])}>
          <Popup>
            <div className="min-w-[160px]">
              <p className="font-heading font-semibold text-primary text-sm mb-0.5">{marker.title}</p>
              <p className="text-xs text-muted-foreground mb-2">{marker.subtitle}</p>
              {marker.href && (
                <Link href={marker.href} className="text-secondary text-xs font-medium hover:text-primary">
                  View details →
                </Link>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
