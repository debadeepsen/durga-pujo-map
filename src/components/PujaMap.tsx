'use client'

import {
  MapContainer,
  TileLayer,
  ZoomControl,
  Marker,
  Popup,
  Polyline
} from 'react-leaflet'
import { useAppSelector } from '@/hooks/storeHooks'
import { PandalInfo } from '@/types/types'
import { OptimizedRoute } from '@/utils/routeOptimization'
import { MapController } from './MapController'
import { useLeafletIcons } from '@/hooks/useLeafletIcons'
import { PandalInfoPopup } from './PandalInfoPopup'
import { attribution } from '@/constants/constants'
import L from 'leaflet';

interface PujaMapProps {
  pandals: PandalInfo[]
  selectedPandals?: number[]
  optimizedRoute?: OptimizedRoute | null
}

const PujaMap = ({ pandals, selectedPandals = [], optimizedRoute }: PujaMapProps) => {
  const { center, zoom } = useAppSelector(state => state.map)
  const icons = useLeafletIcons()

  // Create route polyline coordinates
  const routePositions = optimizedRoute?.waypoints.map(waypoint => 
    [waypoint.latitude, waypoint.longitude] as [number, number]
  ) || []

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: 'calc(100vh - 48px)', width: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution={attribution}
      />
      {pandals.map(pandal => {
        const { latitude, longitude } = pandal.location
        const { category } = pandal.details
        const icon = icons[category] || icons['south']

        return (
          <Marker
            key={pandal.id}
            position={[latitude, longitude]}
            icon={selectedPandals.includes(pandal.id) ? L.divIcon({
              html: `<div class="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>`,
              className: '',
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            }) : icon}
            eventHandlers={{
              click: () => {
                // setSelectedPandal(pandal)
              },
            }}
          >
            <Popup>
              <PandalInfoPopup pandal={pandal} />
            </Popup>
          </Marker>
        )
      })}
      
      {/* Display optimized route polyline */}
      {optimizedRoute && routePositions.length > 1 && (
        <Polyline
          positions={routePositions}
          color="blue"
          weight={4}
          opacity={0.7}
          dashArray="10, 10"
        />
      )}
      
      <ZoomControl position='bottomright' />
      <MapController />
    </MapContainer>
  )
}

export default PujaMap

{
  /* <GeoJSON data={pandals} onEachFeature={onEachFeature} /> */
}
