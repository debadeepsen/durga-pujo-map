'use client'

import { Feature, Point } from 'geojson'
import { Layer } from 'leaflet'
import PujaMap from './PujaMap'
import 'leaflet/dist/leaflet.css'
import { pandals } from '@/data/puja_pandals'
import { useState } from 'react'
import { Drawer } from './ui/Drawer'
import { Icon } from '@iconify-icon/react'
import PujaList from './PujaList'
import { useAppDispatch } from '@/lib/hooks'
import { selectPandal } from '@/features/map/mapSlice'

const PandalMapContainer = () => {
  const [drawerOpen, setDrawerOpen] = useState(true)
  const dispatch = useAppDispatch()

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen)
  }

  const onEachFeature = (feature: Feature<Point>, layer: Layer) => {
    if (feature.properties?.name) {
      layer.bindPopup(`<strong>${feature.properties.name}</strong>`)
      
      // Add click handler to select pandal
      layer.on({
        click: () => {
          const [lng, lat] = feature.geometry.coordinates
          dispatch(selectPandal(feature))
        },
      })
    }
  }

  const handlePandalSelect = (lat: number, lng: number, name: string) => {
    // This will be triggered when a pandal is selected from the list
    dispatch(selectPandal({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [lng, lat],
      },
      properties: {
        name,
      },
    } as Feature<Point>))
  }

  return (
    <div>
      <button 
        className='absolute top-3 left-2 z-50 bg-white p-2 rounded-md shadow-md hover:bg-gray-100 transition-colors'
        onClick={toggleDrawer}
        aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
      >
        <Icon icon='charm:menu-hamburger' width={24} height={24} />
      </button>
      <div className='relative'>
        <Drawer open={drawerOpen} onClose={toggleDrawer} size='320px'>
          <h2 className='text-xl font-semibold mb-2'>Puja List</h2>
          <PujaList onSelect={handlePandalSelect} />
        </Drawer>
        <div className='relative z-1'>
          <PujaMap
            pandals={pandals}
            onEachFeature={onEachFeature}
          />
        </div>
      </div>
    </div>
  )
}

export default PandalMapContainer
