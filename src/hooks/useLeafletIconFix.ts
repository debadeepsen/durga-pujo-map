'use client'

import { useEffect } from 'react'

export const useLeafletIconFix = () => {
  useEffect(() => {
    ;(async () => {
      const L = await import('leaflet') // ✅ only runs in browser

      const DefaultIcon = L.icon({
        iconUrl: require('leaflet/dist/images/marker-icon.png'),      
        // shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
        iconSize: [25, 41],
        iconAnchor: [12, 41]
      })

      L.Marker.prototype.options.icon = DefaultIcon
    })()
  }, [])
}
