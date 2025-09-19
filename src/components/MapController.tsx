import { setViewport } from "@/features/map/mapSlice"
import { useAppDispatch, useAppSelector } from "@/hooks/hooks"
import { popup } from "leaflet"
import { useRef, useEffect } from "react"
import { useMap } from "react-leaflet"

// Component to handle viewport changes and popups
export const MapController = () => {
  const map = useMap()
  const dispatch = useAppDispatch()
  const { viewport, selectedPandal } = useAppSelector(state => state.map)
  const popupRef = useRef<ReturnType<typeof popup> | null>(null)

  // Handle popup when a pandal is selected
  useEffect(() => {
    if (selectedPandal) {
      const { coordinates } = selectedPandal.geometry
      const [lng, lat] = coordinates
      const name = selectedPandal.properties?.name || 'Pandal'

      // Close any existing popup
      if (popupRef.current) {
        popupRef.current.remove()
      }

      // Create and show new popup with offset to position it above the marker
      popupRef.current = popup({
        offset: [0, -20] // Move the popup up by 20 pixels
      })
        .setLatLng([lat, lng])
        .setContent(
          `<div class="p-2 flex gap-2"><strong>${name}</strong></div>`
        )
        .openOn(map)

      // Center map on selected pandal
      map.setView([lat, lng], viewport.zoom)
    } else if (popupRef.current) {
      // Remove popup when no pandal is selected
      popupRef.current.remove()
      popupRef.current = null
    }
  }, [selectedPandal, map])

  // Sync map view with Redux state
  useEffect(() => {
    // Only update view if not currently showing a popup (to avoid jitter)
    if (!selectedPandal) {
      map.setView([viewport.latitude, viewport.longitude], viewport.zoom)
    }
  }, [viewport, map, selectedPandal])

  // Update Redux state when map moves
  const handleMove = () => {
    const center = map.getCenter()
    const zoom = map.getZoom()
    dispatch(
      setViewport({
        latitude: center.lat,
        longitude: center.lng,
        zoom
      })
    )
  }

  useEffect(() => {
    map.on('move', handleMove)
    return () => {
      map.off('move', handleMove)
    }
  }, [map])

  return null
}
