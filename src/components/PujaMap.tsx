'use client'

import {
  MapContainer,
  TileLayer,
  GeoJSON,
  ZoomControl,
  useMap,
  Marker,
  Popup
} from 'react-leaflet'
import { Feature, Point } from 'geojson'
import { Layer, popup } from 'leaflet'
import { useEffect, useRef } from 'react'
import { useAppSelector, useAppDispatch } from '@/hooks/storeHooks'
import { setViewport } from '@/features/map/mapSlice'
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
        const { name, category } = pandal.details
        // const icons = (window as any).pujaIcons || {}
        const icon = icons[category] || icons['south']

        // if (name.toLowerCase().includes('rammohan')) console.log({ name, category, icon })

        return (
          <Marker key={idx} position={[latitude, longitude]} icon={icon}>
            <Popup>
              <div className='flex gap-2'>
                <div>
                  <GoogleMapLink lat={latitude} lng={longitude} />
                </div>
                <div>
                  <div className='mb-1'>
                    <strong>{name}</strong>
                  </div>
                  <div className='text-xs'>
                    {categoryMap[category as keyof typeof categoryMap]}
                  </div>
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
