'use client'

import {
  MapContainer,
  TileLayer,
  ZoomControl,
  Marker,
  Circle,
  Popup,
  Pane
} from 'react-leaflet'
import { useAppSelector } from '@/hooks/storeHooks'
import { PandalInfo } from '@/types/types'
import { MapController } from './MapController'
import { useLeafletIcons } from '@/hooks/useLeafletIcons'
import { PandalInfoPopup } from './PandalInfoPopup'
import { attribution } from '@/constants/constants'
import L from 'leaflet'

interface PujaMapProps {
  pandals: PandalInfo[]
  selectedPandals?: number[]
}

const PujaMap = ({ pandals, selectedPandals = [] }: PujaMapProps) => {
  const { center, zoom } = useAppSelector(state => state.map)
  const icons = useLeafletIcons()

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
            icon={
              selectedPandals.includes(pandal.id)
                ? L.divIcon({
                    html: `<div class="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>`,
                    className: '',
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                  })
                : icon
            }
            eventHandlers={{
              click: () => {
                // setSelectedPandal(pandal)
              }
            }}
          >
            <Popup>
              <PandalInfoPopup pandal={pandal} />
            </Popup>
          </Marker>
        )
      })}
      <Pane name='custom' style={{ zIndex: 100 }}>
        {selectedPandals.map(pandalId => {
          const pandal = pandals.find(p => p.id === pandalId)
          if (!pandal) return null
          const { latitude, longitude } = pandal.location
          return (
            <Circle
              key={pandalId}
              center={[latitude, longitude]}
              radius={200}
              pathOptions={{ color: 'blue', pane: 'custom', opacity: 0.5 }}
            />
          )
        })}
      </Pane>
      <ZoomControl position='bottomright' />
      <MapController />
    </MapContainer>
  )
}

export default PujaMap

{
  /* <GeoJSON data={pandals} onEachFeature={onEachFeature} /> */
}
