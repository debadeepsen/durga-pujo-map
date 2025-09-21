import { AccordionDetails, AccordionSummary } from '@mui/material'
import { ReactNode } from 'react'
import { Icon } from '@iconify-icon/react'
import { useDarkMode } from '@/hooks/useDarkMode'

export const Summary = ({ children }: { children: ReactNode }) => {
  const isDark = useDarkMode()

  return (
    <AccordionSummary
      expandIcon={<Icon icon='lucide:chevron-down' style={{ color: isDark ? 'var(--color-gray-200)' : 'var(--color-gray-800)' }} />}
      sx={{
        backgroundColor: isDark
          ? 'var(--color-gray-800)'
          : 'var(--color-gray-100)',
        color: isDark ? 'var(--color-gray-200)' : 'var(--color-gray-800)'
      }}
    >
      {children}
    </AccordionSummary>
  )
}

export const Details = ({ children }: { children: ReactNode }) => {
  const isDark = useDarkMode()

  return (
    <AccordionDetails
      sx={{
        backgroundColor: isDark
          ? 'var(--color-gray-900)'
          : 'var(--color-gray-100)',
        color: isDark ? 'var(--color-gray-200)' : 'var(--color-gray-800)'
      }}
    >
      {children}
    </AccordionDetails>
  )
}
