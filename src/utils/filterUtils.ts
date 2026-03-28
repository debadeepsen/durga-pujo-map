import { PandalInfo } from '@/types/types'
import { FilterOptions } from '@/components/EnhancedFilters'

export function applyEnhancedFilters(pandals: PandalInfo[], filters: FilterOptions): PandalInfo[] {
  return pandals.filter(pandal => {
    // Theme filter
    if (filters.themes.length > 0) {
      if (!pandal.details.theme || !filters.themes.includes(pandal.details.theme)) {
        return false
      }
    }

    // Awards filter
    if (filters.hasAwards) {
      if (!pandal.details.awards || pandal.details.awards.length === 0) {
        return false
      }
    }

    // Accessibility filters
    if (filters.wheelchairAccessible) {
      if (!pandal.details.accessibility?.wheelchairAccessible) {
        return false
      }
    }

    if (filters.parkingAvailable) {
      if (!pandal.details.accessibility?.parkingAvailable) {
        return false
      }
    }

    // Crowd level filter
    if (filters.crowdLevels.length > 0) {
      if (!pandal.details.crowdLevel || !filters.crowdLevels.includes(pandal.details.crowdLevel)) {
        return false
      }
    }

    // Entry fee filter
    if (filters.maxEntryFee < 1000) {
      const entryFee = pandal.details.entryFee || 0
      if (entryFee > filters.maxEntryFee) {
        return false
      }
    }

    // Category filter
    if (filters.categories.length > 0) {
      if (!filters.categories.includes(pandal.details.category)) {
        return false
      }
    }

    return true
  })
}

export function getFilterSummary(filters: FilterOptions): string[] {
  const summary: string[] = []

  if (filters.themes.length > 0) {
    summary.push(`Themes: ${filters.themes.join(', ')}`)
  }

  if (filters.hasAwards) {
    summary.push('Award winners only')
  }

  if (filters.wheelchairAccessible) {
    summary.push('Wheelchair accessible')
  }

  if (filters.parkingAvailable) {
    summary.push('Parking available')
  }

  if (filters.crowdLevels.length > 0) {
    summary.push(`Crowd: ${filters.crowdLevels.join(', ')}`)
  }

  if (filters.maxEntryFee < 1000) {
    summary.push(`Max fee: ₹${filters.maxEntryFee}`)
  }

  if (filters.categories.length > 0) {
    summary.push(`Categories: ${filters.categories.join(', ')}`)
  }

  return summary
}
