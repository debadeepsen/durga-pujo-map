import { MapContainer, TileLayer, GeoJSON, ZoomControl } from 'react-leaflet'
import { Feature, Geometry } from 'geojson'
import { Layer } from 'leaflet'

interface PujaMapProps {
  center: [number, number]
  zoom: number
  pandals: any // You might want to replace 'any' with a proper type
  onEachFeature: (feature: Feature<Geometry, any>, layer: Layer) => void
}

const PujaMap = ({
  center,
  zoom,
  pandals,
  onEachFeature
}: PujaMapProps) => {
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
    </MapContainer>
  )
}

export default PujaMap
