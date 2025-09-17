'use client'

import { MapContainer, TileLayer, GeoJSON, ZoomControl } from 'react-leaflet'
import type { Feature, GeoJSON as GeoJSONType, Geometry } from 'geojson'
import 'leaflet/dist/leaflet.css'
import { pandals } from '@/data/puja_pandals'
import { Layer } from 'leaflet'
import { useState } from 'react'
import { Drawer } from './ui/Drawer'
import { Icon } from '@iconify-icon/react'

const PandalMap = () => {
  const [drawerOpen, setDrawerOpen] = useState(true)

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen)
  }

  const onEachFeature = (feature: Feature<Geometry, any>, layer: Layer) => {
    if (feature.properties?.name) {
      layer.bindPopup(`<strong>${feature.properties.name}</strong>`)
    }
  }

  return (
    <div>
      <button className='absolute top-3 left-2 z-50' onClick={toggleDrawer}>
        <Icon icon='charm:menu-hamburger' width={24} height={24} />
      </button>
      <div className='relative'>
        <Drawer open={drawerOpen} onClose={toggleDrawer} size='320px'>
          Filters
        </Drawer>
        <div className='relative z-1'>
          <MapContainer
            center={[22.5386, 88.3462]}
            zoom={12.65}
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
        </div>
      </div>
    </div>
  )
}

export default PandalMap
