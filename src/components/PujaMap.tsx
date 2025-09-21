'use client'

import {
  MapContainer,
  TileLayer,
  ZoomControl,
  Marker,
  Popup
} from 'react-leaflet'
import { useAppSelector } from '@/hooks/storeHooks'
import { PandalInfo } from '@/types/types'
import { MapController } from './MapController'
import { useLeafletIcons } from '@/hooks/useLeafletIcons'
import { PandalInfoPopup } from './PandalInfoPopup'
import { attribution } from '@/constants/constants'

interface PujaMapProps {
  pandals: PandalInfo[]
}

const PujaMap = ({ pandals }: PujaMapProps) => {
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
      {pandals.map((pandal, idx) => {
        const { latitude, longitude } = pandal.location
        const { category } = pandal.details
        const icon = icons[category] || icons['south']

        return (
          <Marker key={idx} position={[latitude, longitude]} icon={icon}>
            <Popup>
              <PandalInfoPopup pandal={pandal} />
            </Popup>
          </Marker>
        )
      })}
      <ZoomControl position='bottomright' />
      <MapController />
    </MapContainer>
  )
}

export default PujaMap

{
  /* <GeoJSON data={pandals} onEachFeature={onEachFeature} /> */
}
