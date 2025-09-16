'use client'

import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import type { GeoJSON as GeoJSONType } from 'geojson'
import 'leaflet/dist/leaflet.css'
import pandals from '@/data/puja_pandals'

const PandalMap = () => {
  const onEachFeature = (feature: any, layer: any) => {
    if (feature.properties?.name) {
      layer.bindPopup(`<b>${feature.properties.name}</b>`)
    }
  }

  return (
    <MapContainer
      center={[22.5386, 88.3462]}
      zoom={12.65}
      style={{ height: 'calc(100vh - 90px)', width: '100%' }}
    >
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OSM</a>"
      />
      <GeoJSON data={pandals as GeoJSONType} onEachFeature={onEachFeature} />
    </MapContainer>
  )
}

export default PandalMap
