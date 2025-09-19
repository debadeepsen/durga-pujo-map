'use client'

import {
  MapContainer,
  TileLayer,
  GeoJSON,
  ZoomControl,
  useMap
} from 'react-leaflet'
import { Feature, Point } from 'geojson'
import { Layer, Marker, Popup, popup } from 'leaflet'
import { useEffect, useRef } from 'react'
import { useAppSelector, useAppDispatch } from '@/hooks/hooks'
import { setViewport } from '@/features/map/mapSlice'
import { PandalInfo } from '@/types/types'
import { MapController } from './MapController'

interface PujaMapProps {
  pandals: PandalInfo[] // You might want to replace 'any' with a proper type
  onEachFeature: (feature: Feature<Point>, layer: Layer) => void
}

const PujaMap = ({ pandals, onEachFeature }: PujaMapProps) => {
  const { center, zoom } = useAppSelector(state => state.map)

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
      
      {pandals.map((pandal, idx) => {
        const { latitude, longitude } = pandal.location
        const { name, description, category } = pandal.details
        const icons = (window as any).pujaIcons || {}
        const icon = icons[category] || icons['south']

        return ('p'
          // <Marker key={idx} position={[latitude, longitude]} icon={icon}>
          //   <Popup>
          //     <strong>{name}</strong>
          //     <br />
          //     {description}
          //   </Popup>
          // </Marker>
        )
      })}
      <ZoomControl position='bottomright' />
      <MapController />
    </MapContainer>
  )
}

export default PujaMap

{/* <GeoJSON data={pandals} onEachFeature={onEachFeature} /> */}