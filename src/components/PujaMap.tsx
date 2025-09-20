'use client'

import {
  MapContainer,
  TileLayer,
  ZoomControl,
  Marker,
  Popup
} from 'react-leaflet'
import { useAppSelector } from '@/hooks/hooks'
import { PandalInfo } from '@/types/types'
import { MapController } from './MapController'
import { useLeafletIcons } from '@/hooks/useLeafletIcons'
import { categoryMap } from '@/constants/constants'
import GoogleMapLink from './GoogleMapLink'

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
        attribution="&copy; <a target='_blank' href='https://www.openstreetmap.org/copyright'>OSM</a>"
      />
      {/* <Marker position={[22.469789, 88.391616]} /> */}
      {pandals.map((pandal, idx) => {
        const { latitude, longitude } = pandal.location
        const { name, category, description } = pandal.details
        const icon = icons[category] || icons['south']

        return (
          <Marker
            key={idx}
            position={[latitude, longitude]}
            icon={icon}
          >
            <Popup>
              <div className='p-2 min-w-[200px]'>
                <div className='mb-1'>
                  <strong className='text-base'>{name}</strong>
                </div>
                <div className='text-sm text-gray-600 mb-2'>
                  {categoryMap[category as keyof typeof categoryMap]}
                </div>
                {description && (
                  <div className='text-xs text-gray-500 mb-2'>
                    {typeof description === 'string' ? description : description.value}
                  </div>
                )}
                <div className='mt-2'>
                  <GoogleMapLink lat={latitude} lng={longitude} />
                </div>
              </div>
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
