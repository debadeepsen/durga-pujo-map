'use client'

import L from 'leaflet'
import { useEffect } from 'react'

export const useLeafletIcons = () => {
  useEffect(() => {
    const icons: Record<string, L.Icon> = {
      north: L.icon({
        iconUrl: '/icons/north.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [0, -28]
      }),
      south: L.icon({
        iconUrl: '/icons/south.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [0, -28]
      }),
      salt_lake: L.icon({
        iconUrl: '/icons/saltlake.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [0, -28]
      }),
      aristocratic: L.icon({
        iconUrl: '/icons/bonedi.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [0, -28]
      })
    }

    // Attach to global so Map component can use
    ;(window as any).pujaIcons = icons
  }, [])
}
