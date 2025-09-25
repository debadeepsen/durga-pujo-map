'use client'

import { Feature, Point } from 'geojson'
import PujaMap from './PujaMap'
import 'leaflet/dist/leaflet.css'
import pandals from '@/data/puja_pandals.json'
import { useState, useEffect } from 'react'
import { Drawer } from './ui/Drawer'
import { Icon } from '@iconify-icon/react'
import PujaList from './PujaList'
import { useAppDispatch } from '@/hooks/storeHooks'
import { selectPandal } from '@/features/map/mapSlice'
import { useMediaQuery } from '@mui/material'

const PandalMapContainer = () => {
  const isMobile = useMediaQuery('(max-width: 640px)')
  const [drawerOpen, setDrawerOpen] = useState(!isMobile)
  const [tripPlannerMode, setTripPlannerMode] = useState(false)
  const [selectedPandals, setSelectedPandals] = useState<number[]>([])
  const [tripName, setTripName] = useState('')
  const [savedTrips, setSavedTrips] = useState<Array<{
    id: string
    name: string
    pandalIds: number[]
    createdAt: string
  }>>([])
  const dispatch = useAppDispatch()

  // Load saved trips on mount
  useEffect(() => {
    const savedTrips = localStorage.getItem('savedTrips')
    if (savedTrips) {
      try {
        const trips = JSON.parse(savedTrips)
        setSavedTrips(trips)
      } catch (e) {
        console.error('Failed to parse saved trips', e)
        localStorage.removeItem('savedTrips')
      }
    }
  }, [])

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen)
  }

  const handlePandalSelect = (lat: number, lng: number, name: string, id: number) => {
    if (tripPlannerMode) {
      setSelectedPandals(prev => 
        prev.includes(id) 
          ? prev.filter(pId => pId !== id)
          : [...prev, id]
      )
      return
    }

    dispatch(
      selectPandal({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        properties: {
          name,
          id
        }
      } as Feature<Point>)
    )
    if (isMobile) setDrawerOpen(false)
  }

  const saveTrip = () => {
    if (!tripName.trim() || selectedPandals.length === 0) return
    
    const tripId = `trip_${Date.now()}`
    const newTrip = {
      id: tripId,
      name: tripName.trim(),
      pandalIds: selectedPandals,
      createdAt: new Date().toISOString()
    }
    
    const updatedTrips = [...savedTrips, newTrip]
    localStorage.setItem('savedTrips', JSON.stringify(updatedTrips))
    setSavedTrips(updatedTrips)
    setTripName('')
    setSelectedPandals([])
    setTripPlannerMode(false)
  }

  const loadTrip = (tripId: string) => {
    const trip = savedTrips.find(t => t.id === tripId)
    if (!trip) return
    
    setSelectedPandals(trip.pandalIds || [])
  }

  return (
    <div>
      <button
        className='absolute top-1 left-2 z-50 p-2 rounded-md shadow-md hover:bg-gray-500/20 transition-colors'
        onClick={toggleDrawer}
        aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
      >
        <Icon icon='famicons:list-circle-outline' width={24} height={24} />
      </button>
      <div className='relative'>
        <Drawer
          open={drawerOpen}
          onClose={toggleDrawer}
          className='w-full sm:w-[350px]'
        >
          <div className='p-4'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-semibold'>Puja List</h2>
              <button
                onClick={() => setTripPlannerMode(!tripPlannerMode)}
                className={`px-3 py-1 rounded-md text-sm ${tripPlannerMode ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}
              >
                {tripPlannerMode ? 'Cancel Trip' : 'Plan a Trip'}
              </button>
            </div>

            {tripPlannerMode && (
              <div className='mb-4 p-3 bg-gray-100 dark:bg-gray-800 border dark:border-gray-700 rounded-lg'>
                <div className='mb-2'>
                  <input
                    type='text'
                    value={tripName}
                    onChange={(e) => setTripName(e.target.value)}
                    placeholder='Enter trip name'
                    className='w-full p-2 bg-gray-100 dark:bg-gray-900 dark:border-gray-700 rounded'
                  />
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-gray-600'>
                    {selectedPandals.length} pandals selected
                  </span>
                  <button
                    onClick={saveTrip}
                    disabled={!tripName.trim() || selectedPandals.length === 0}
                    className='px-3 py-1 bg-green-500 text-white rounded-md disabled:opacity-50'
                  >
                    Save Trip
                  </button>
                </div>
              </div>
            )}

            {savedTrips.length > 0 && (
              <div className='mb-4'>
                <h3 className='font-medium mb-2'>Saved Trips</h3>
                <div className='space-y-2'>
                  {savedTrips
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map(trip => (
                      <div key={trip.id} className='flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-800 border dark:border-gray-700 rounded'>
                        <div>
                          <div className='font-medium'>{trip.name}</div>
                          <div className='text-xs text-gray-500'>
                            {trip.pandalIds?.length || 0} pandals • {new Date(trip.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <button 
                          onClick={() => loadTrip(trip.id)}
                          className='px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600'
                        >
                          Load
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}

            <PujaList 
              onSelect={handlePandalSelect} 
              selectedPandals={tripPlannerMode ? selectedPandals : []}
            />
          </div>
        </Drawer>
        <div className='relative z-1'>
          <PujaMap pandals={pandals} />
        </div>
      </div>
    </div>
  )
}

export default PandalMapContainer
