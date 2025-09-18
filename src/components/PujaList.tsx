'use client'

import { useEffect, useState } from 'react'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List
} from '@mui/material'
import { ClassifiedPujas } from '@/types/types'
import { Icon } from '@iconify-icon/react'
import { endpoints } from '@/constants/constants'
import GoogleMapLink from './GoogleMapLink'

type PujaListProps = {
  onSelect?: (lat: number, lng: number, name: string) => void
}

const PujaList = ({ onSelect }: PujaListProps) => {
  const [data, setData] = useState<ClassifiedPujas | null>(null)
  const [expanded, setExpanded] = useState<string | false>(false)

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(endpoints.list)
      const json = await res.json()
      setData(json)

      // Open first section by default
      const firstKey = Object.keys(json)[0]
      setExpanded(firstKey)
    }
    fetchData()
  }, [])

  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false)
    }

  if (!data) {
    return <Typography>Loading puja list...</Typography>
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
            <span className='text-base font-semibold'>{category}</span>
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
