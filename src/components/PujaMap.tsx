'use client'

import { MapContainer, TileLayer, GeoJSON, ZoomControl, useMap, Popup } from 'react-leaflet'
import { Feature, Point } from 'geojson'
import { Layer, LatLng, popup } from 'leaflet'
import { useEffect, useRef } from 'react'
import { useAppSelector, useAppDispatch } from '@/lib/hooks'
import { setViewport, selectPandal } from '@/features/map/mapSlice'

interface PujaMapProps {
  pandals: any // You might want to replace 'any' with a proper type
  onEachFeature: (feature: Feature<Point>, layer: Layer) => void
}

// Component to handle viewport changes and popups
function MapController() {
  const map = useMap()
  const dispatch = useAppDispatch()
  const { viewport, selectedPandal } = useAppSelector((state) => state.map)
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
        .setContent(`<div class="p-2"><strong>${name}</strong></div>`)
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
        zoom,
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

const PujaMap = ({ pandals, onEachFeature }: PujaMapProps) => {
  const { center, zoom } = useAppSelector((state) => state.map)

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: 'calc(100vh - 48px)', width: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution="&copy; <a target='_blank' href='https://www.openstreetmap.org/copyright'>OSM</a>"
      />
      <GeoJSON data={pandals} onEachFeature={onEachFeature} />
      <ZoomControl position='bottomright' />
      <MapController />
    </MapContainer>
  )
}

export default PujaMap
