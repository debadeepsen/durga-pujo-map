'use client'

import { useState, useMemo } from 'react'
import { Accordion, Typography, List } from '@mui/material'
import { categoryMap } from '@/constants/constants'
import pandals from '@/data/puja_pandals.json'
import GoogleMapLink from './GoogleMapLink'
import { SearchBox } from './ui/SearchBox'
import { Details, Summary } from './ui/accordion/components'
import { getCategorizedData } from '@/utils/utils'
import { ClassifiedPujas, PandalInfo } from '@/types/types'

type PujaListProps = {
  onSelect?: (lat: number, lng: number, name: string) => void
}

const PujaList = ({ onSelect }: PujaListProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  const data = useMemo(() => getCategorizedData(pandals), [pandals])
  const filteredData = useMemo(() => {
    const filtered: ClassifiedPujas = {
      aristocratic: [],
      north: [],
      salt_lake: [],
      south: []
    }

    const categoryMatch: string[] = []
    pandals.forEach(pandal => {
      const { name, category } = pandal.details
      if (name.toLowerCase().includes(searchQuery.toLowerCase())) {
        filtered[category as keyof ClassifiedPujas].push(pandal)
        categoryMatch.push(category)
      }
    })

    setExpandedSections([...new Set(categoryMatch)])

    return filtered
  }, [pandals, searchQuery])

  const displayData = searchQuery.trim() ? filteredData : data

  const handleToggle = (isExpanded: boolean, category: string) => {
    console.log({ isExpanded, category })
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
                      className='flex items-center gap-2 mb-2 w-full text-left'
                      onClick={() => onSelect?.(latitude, longitude, name)}
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
