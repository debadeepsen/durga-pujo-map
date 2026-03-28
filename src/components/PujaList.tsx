'use client'

import { useState, useMemo } from 'react'
import { Accordion, Typography, List } from '@mui/material'
import { categoryMap } from '@/constants/constants'
import pandals from '@/data/puja_pandals.json'
import GoogleMapLink from './GoogleMapLink'
import { SearchBox } from './ui/SearchBox'
import { Details, Summary } from './ui/accordion/components'
import { getCategorizedData } from '@/utils/utils'
import { EnhancedFilters, FilterOptions } from './EnhancedFilters'
import { applyEnhancedFilters } from '@/utils/filterUtils'
import { ClassifiedPujas, PandalInfo } from '@/types/types'

type PujaListProps = {
  onSelect?: (lat: number, lng: number, name: string, id: number) => void
  selectedPandals?: number[]
}

const PujaList = ({ onSelect, selectedPandals = [] }: PujaListProps) => {
  console.log({ selectedPandals })
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [enhancedFilters, setEnhancedFilters] = useState<FilterOptions>({
    themes: [],
    hasAwards: false,
    wheelchairAccessible: false,
    parkingAvailable: false,
    crowdLevels: [],
    maxEntryFee: 1000,
    categories: []
  })

  const data = useMemo(() => getCategorizedData(pandals), [pandals])
  
  // Apply enhanced filters first, then search
  const filteredByEnhancedFilters = useMemo(() => {
    return applyEnhancedFilters(pandals, enhancedFilters)
  }, [pandals, enhancedFilters])

  const filteredData = useMemo(() => {
    const filtered: ClassifiedPujas = {
      aristocratic: [],
      north: [],
      salt_lake: [],
      south: []
    }

    const categoryMatch: string[] = []
    filteredByEnhancedFilters.forEach(pandal => {
      const { name, category } = pandal.details
      if (name.toLowerCase().includes(searchQuery.toLowerCase())) {
        filtered[category as keyof ClassifiedPujas].push(pandal)
        categoryMatch.push(category)
      }
    })

    setExpandedSections([...new Set(categoryMatch)])

    return filtered
  }, [filteredByEnhancedFilters, searchQuery])

  const displayData = searchQuery.trim() || Object.values(enhancedFilters).some(v => 
  Array.isArray(v) ? v.length > 0 : v === true
) ? filteredData : getCategorizedData(filteredByEnhancedFilters)

  const handleToggle = (isExpanded: boolean, category: string) => {
    setExpandedSections(prev => {
      const newSections = [...prev]
      if (!isExpanded) {
        newSections.splice(newSections.indexOf(category), 1)
      } else {
        newSections.push(category)
      }
      console.log(newSections)
      return [...new Set(newSections)]
    })
  }

  return (
    <div>
      <SearchBox onSearch={setSearchQuery} className='mb-2' />
      <EnhancedFilters
        pandals={pandals}
        onFiltersChange={setEnhancedFilters}
        activeFiltersCount={Object.values(enhancedFilters).filter((v, i) => 
          Array.isArray(v) ? v.length > 0 : v === true && i !== 5 // Skip maxEntryFee default
        ).length}
      />
      {Object.entries(displayData).map(([category, pandalList]) => (
        <Accordion
          key={category}
          expanded={expandedSections.includes(category)}
          onChange={(_e, isExpanded) => {
            handleToggle(isExpanded, category)
          }}
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
              {(pandalList as PandalInfo[]).map(pandal => {
                const { latitude, longitude } = pandal.location
                const { name } = pandal.details
                return (
                  <div key={pandal.id}>
                    <button
                      className={`flex items-center gap-2 rounded-sm mb-2 w-full text-left ${selectedPandals.includes(pandal.id) ? 'bg-blue-100 dark:bg-slate-600' : ''}`}
                      onClick={() => onSelect?.(latitude, longitude, name, pandal.id)}
                    >
                      <GoogleMapLink lat={latitude} lng={longitude} />
                      <span className='text-sm text-gray-500 dark:text-gray-300 text-left'>
                        {name}
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
