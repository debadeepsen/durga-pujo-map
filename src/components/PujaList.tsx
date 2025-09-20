'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  Box,
  Paper
} from '@mui/material'
import { Icon } from '@iconify-icon/react'
import { categoryMap } from '@/constants/constants'
import { PandalInfo } from '@/types/types'
import GoogleMapLink from './GoogleMapLink'
import DebouncedSearch from './DebouncedSearch'

type ClassifiedPujas = Record<string, PandalInfo[]>

type PujaListProps = {
  onSelect?: (lat: number, lng: number, name: string, category: string) => void
  pandals: PandalInfo[]
}

const PujaList = ({ onSelect, pandals }: PujaListProps) => {
  const [expanded, setExpanded] = useState<string | false>(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Filter function to search in name and description
  const filterPandals = useCallback((pandals: PandalInfo[], term: string) => {
    if (!term.trim()) return pandals
    
    const lowerTerm = term.toLowerCase()
    return pandals.filter(p => {
      const desc = typeof p.details.description === 'string' 
        ? p.details.description 
        : p.details.description?.value || ''
      
      return (
        p.details.name.toLowerCase().includes(lowerTerm) ||
        desc.toLowerCase().includes(lowerTerm)
      )
    })
  }, [])

  // Transform and filter the data
  const data = useMemo<ClassifiedPujas>(() => {
    const result: ClassifiedPujas = {}
    
    // Initialize all categories from categoryMap
    Object.keys(categoryMap).forEach(category => {
      result[category] = []
    })
    
    // Filter pandals based on search term
    const filteredPandals = filterPandals(pandals, searchTerm)
    
    // Populate the categories with pandal data
    filteredPandals.forEach(pandal => {
      const { category } = pandal.details
      
      if (result[category]) {
        result[category].push(pandal)
      } else {
        // If category doesn't exist in categoryMap, add it to 'south' category as fallback
        if (!result['south']) result['south'] = []
        result['south'].push(pandal)
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
  // const firstKey = Object.keys(data)[0]
  // if (firstKey && expanded === false) {
  //   setExpanded(firstKey)
  // }

  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false)
    }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  if (Object.keys(data).length === 0) {
    return (
      <Paper elevation={0} className="p-4 text-center">
        <Typography color="textSecondary">
          {searchTerm ? 'No matching puja pandals found.' : 'No puja pandals available.'}
        </Typography>
      </Paper>
    )
  }

  return (
    <Box className="space-y-4">
      <Paper elevation={0} className="p-4 sticky top-0 z-10 bg-white/80 backdrop-blur-sm">
        <DebouncedSearch 
          onSearch={handleSearch}
          placeholder="Search puja pandals..."
          className="max-w-md mx-auto"
        />
      </Paper>
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
              {features.map((pandal, idx) => (
                <div key={idx}>
                  <button
                    className='flex items-center gap-2 mb-2 w-full text-left'
                    onClick={() => onSelect?.(
                      pandal.location.latitude, 
                      pandal.location.longitude, 
                      pandal.details.name,
                      pandal.details.category
                    )}
                  >
                    <GoogleMapLink 
                      lat={pandal.location.latitude} 
                      lng={pandal.location.longitude} 
                    />
                    <span className='text-sm text-gray-500 text-left'>
                      {pandal.details.name}
                    </span>
                  </button>
                </div>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  )
}

export default PujaList
