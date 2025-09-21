'use client'

import { useState, useMemo } from 'react'
import { Accordion, Typography, List } from '@mui/material'
import { categoryMap } from '@/constants/constants'
import { pandals } from '@/data/puja_pandals_formatted'
import GoogleMapLink from './GoogleMapLink'
import { SearchBox } from './ui/SearchBox'
import { Details, Summary } from './ui/accordion/components'

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
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

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
          description:
            typeof description === 'string' ? description : description.value
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

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data
    
    const query = searchQuery.toLowerCase()
    const result: ClassifiedPujas = {}
    const sectionsWithMatches = new Set<string>()
    
    Object.entries(data).forEach(([category, features]) => {
      const matchingFeatures = features.filter(feature => 
        feature.properties.name.toLowerCase().includes(query)
      )
      
      if (matchingFeatures.length > 0) {
        result[category] = matchingFeatures
        sectionsWithMatches.add(category)
      }
    })
    
    // Update expanded sections based on search results
    setExpandedSections(prev => {
      const newSections = new Set(prev)
      sectionsWithMatches.forEach(section => newSections.add(section))
      return newSections
    })
    
    return result
  }, [data, searchQuery])
  
  // Use filtered data or all data if no search query
  const displayData = searchQuery.trim() ? filteredData : data

  const handleSectionToggle = (category: string) => {
    setExpandedSections(prev => {
      const newSections = new Set(prev)
      if (newSections.has(category)) {
        newSections.delete(category)
      } else {
        newSections.add(category)
      }
      return newSections
    })
  }

  if (Object.keys(data).length === 0) {
    return <Typography>No puja pandals found.</Typography>
  }

  return (
    <div>
      <SearchBox
        onSearch={setSearchQuery}
        className='mb-2'
      />
      {Object.entries(displayData).map(([category, features]) => (
        <Accordion
          key={category}
          expanded={expandedSections.has(category)}
          onChange={() => handleSectionToggle(category)}
          slotProps={{ transition: { unmountOnExit: true } }}
          disableGutters
        >
          <Summary>
            <span className='text-base font-semibold'>
              {categoryMap[category as keyof typeof categoryMap] || category}
            </span>
          </Summary>
          <Details>
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
                      <span className='text-sm text-gray-500 dark:text-gray-300 text-left'>
                        {f.properties.name}
                      </span>
                    </button>
                  </div>
                )
              })}
            </List>
          </Details>
        </Accordion>
      ))}
    </div>
  )
}

export default PujaList
