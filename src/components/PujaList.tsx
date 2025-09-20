'use client'

import { useState, useMemo } from 'react'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List
} from '@mui/material'
import { Icon } from '@iconify-icon/react'
import { categoryMap } from '@/constants/constants'
import { pandals } from '@/data/puja_pandals_formatted'
import GoogleMapLink from './GoogleMapLink'

interface PandalFeature {
  type: 'Feature'
  geometry: {
    type: 'Point'
    coordinates: [number, number] // [lng, lat]
  }
  properties: {
    name: string
    description: string
  }
}

type ClassifiedPujas = Record<string, PandalFeature[]>

type PujaListProps = {
  onSelect?: (lat: number, lng: number, name: string) => void
}

const PujaList = ({ onSelect }: PujaListProps) => {
  const [expanded, setExpanded] = useState<string | false>(false)

  // Transform the data to match the expected format
  const data = useMemo<ClassifiedPujas>(() => {
    const result: ClassifiedPujas = {}
    
    // Initialize all categories from categoryMap
    Object.keys(categoryMap).forEach(category => {
      result[category] = []
    })
    
    // Populate the categories with pandal data
    pandals.forEach(pandal => {
      const { latitude, longitude } = pandal.location
      const { name, category, description } = pandal.details
      
      const feature: PandalFeature = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [longitude, latitude] // Note: GeoJSON uses [lng, lat]
        },
        properties: {
          name,
          description: typeof description === 'string' ? description : description.value
        }
      }
      
      if (result[category]) {
        result[category].push(feature)
      } else {
        // If category doesn't exist in categoryMap, add it to 'other' category
        if (!result['south']) result['south'] = []
        result['south'].push(feature)
      }
    })
    
    // Remove empty categories
    Object.keys(result).forEach(key => {
      if (result[key].length === 0) {
        delete result[key]
      }
    })
    
    return result
  }, [])
  
  // Set the first category as expanded by default
  const firstKey = Object.keys(data)[0]
  if (firstKey && expanded === false) {
    setExpanded(firstKey)
  }

  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false)
    }

  if (Object.keys(data).length === 0) {
    return <Typography>No puja pandals found.</Typography>
  }

  return (
    <div>
      {Object.entries(data).map(([category, features]) => (
        <Accordion
          key={category}
          expanded={expanded === category}
          onChange={handleChange(category)}
          slotProps={{ transition: { unmountOnExit: true } }}
        >
          <AccordionSummary expandIcon={<Icon icon='lucide:chevron-down' />}>
            <span className='text-base font-semibold'>
              {categoryMap[category as keyof typeof categoryMap] || category}
            </span>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {features.map((f, idx) => {
                const [lng, lat] = f.geometry.coordinates
                return (
                  <div key={idx}>
                    <button
                      className='flex items-center gap-2 mb-2 w-full text-left'
                      onClick={() => onSelect?.(lat, lng, f.properties.name)}
                    >
                      <GoogleMapLink lat={lat} lng={lng} />
                      <span className='text-sm text-gray-500 text-left'>
                        {f.properties.name}
                      </span>
                    </button>
                  </div>
                )
              })}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  )
}

export default PujaList
