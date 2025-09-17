'use client'

import { Feature, Geometry } from 'geojson'
import { Layer } from 'leaflet'
import PujaMap from './PujaMap'
import 'leaflet/dist/leaflet.css'
import { pandals } from '@/data/puja_pandals'
import { useState } from 'react'
import { Drawer } from './ui/Drawer'
import { Icon } from '@iconify-icon/react'
import PujaList from './PujaList'

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
          <h2 className='text-xl font-semibold mb-2'>Puja List</h2>
          <PujaList />
        </Drawer>
        <div className='relative z-1'>
          <PujaMap
            center={[22.5386, 88.3462]}
            zoom={12.65}
            pandals={pandals}
            onEachFeature={onEachFeature}
          />
        </div>
      </div>
    </div>
  )
}

export default PandalMap
