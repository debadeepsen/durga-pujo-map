'use client'

import L from 'leaflet'
import { useEffect } from 'react'

export const useLeafletIcons = () => {
  const icons: Record<string, L.Icon> = {
    north: L.icon({
      iconUrl: '/marker-icons/marker-icon-red.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [0, -28]
    }),
    south: L.icon({
      iconUrl: '/marker-icons/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [0, -28]
    }),
    salt_lake: L.icon({
      iconUrl: '/marker-icons/marker-icon-green.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [0, -28]
    }),
    aristocratic: L.icon({
      iconUrl: '/marker-icons/marker-icon-orange.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [0, -28]
    })
  }
  useEffect(() => {
    // Attach to global so Map component can use
    ;(window as any).pujaIcons = icons
  }, [])

  return icons
}
