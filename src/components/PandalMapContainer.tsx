'use client'

import { PandalInfo } from '@/types/types'
import PujaMap from './PujaMap'
import 'leaflet/dist/leaflet.css'
import { pandals } from '@/data/puja_pandals_formatted'
import { useState } from 'react'
import { Drawer } from './ui/Drawer'
import { Icon } from '@iconify-icon/react'
import PujaList from './PujaList'
import { useAppDispatch } from '@/hooks/hooks'
import { selectPandal } from '@/features/map/mapSlice'

const PandalMapContainer = () => {
  const [drawerOpen, setDrawerOpen] = useState(true)
  const dispatch = useAppDispatch()

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen)
  }

  const handlePandalSelect = (lat: number, lng: number, name: string, category: string) => {
    // This will be triggered when a pandal is selected from the list
    dispatch(selectPandal({
      location: { latitude: lat, longitude: lng },
      details: { name, category, description: '' }
    } as PandalInfo))
  }

  return (
    <div>
      <button 
        className='absolute top-1 left-2 z-50 p-2 rounded-md shadow-md hover:bg-gray-500/20 transition-colors'
        onClick={toggleDrawer}
        aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
      >
        <Icon icon='charm:menu-hamburger' width={24} height={24} />
      </button>
      <div className='relative'>
        <Drawer open={drawerOpen} onClose={toggleDrawer} size='320px'>
          <h2 className='text-xl font-semibold -mt-2 mb-2'>Puja List</h2>
          <PujaList onSelect={handlePandalSelect} pandals={pandals} />
        </Drawer>
        <div className='relative z-1'>
          <PujaMap
            pandals={pandals}
          />
        </div>
      </div>
    </div>
  )
}

export default PandalMapContainer
