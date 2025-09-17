'use client'

import { useEffect, useState } from 'react'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  ListItem,
  ListItemText
} from '@mui/material'
import { ClassifiedPujas } from '@/types/types'
import { Icon } from '@iconify-icon/react'
import { endpoints } from '@/constants/constants'

const PujaList = () => {
  const [data, setData] = useState<ClassifiedPujas | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(endpoints.list)
      const json = await res.json()
      setData(json)
    }
    fetchData()
  }, [])

  if (!data) {
    return <Typography>Loading puja list...</Typography>
  }

  return (
    <div>
      {Object.entries(data).map(([category, features]) => (
        <Accordion
          key={category}
          defaultExpanded
          slotProps={{ transition: { unmountOnExit: true } }}
        >
          <AccordionSummary expandIcon={<Icon icon='lucide:chevron-down' />}>
            <span className='text-base font-semibold'>{category}</span>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {features.map((f, idx) => (
                <div key={idx}>
                  <button className='flex items-center gap-2 mb-2'>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${f.geometry.coordinates[1]},${f.geometry.coordinates[0]}`}
                      target='_blank'
                      rel='noopener noreferrer'
                      title='Open in Google Maps'
                    >
                      <Icon icon='logos:google-maps' width={18} height={18} className='relative top-1' />
                    </a>
                    <span className='text-sm text-gray-500 text-left'>
                      {f.properties.name}
                    </span>
                  </button>
                </div>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  )
}

export default PujaList
