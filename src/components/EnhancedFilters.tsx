'use client'

import { useState, useEffect } from 'react'
import { Box, Chip, FormControl, InputLabel, Select, MenuItem, Typography, Accordion, AccordionSummary, AccordionDetails, Checkbox, FormGroup, FormControlLabel } from '@mui/material'
import { ExpandMore, FilterAlt } from '@mui/icons-material'
import { PandalInfo } from '@/types/types'

export interface FilterOptions {
  themes: string[]
  hasAwards: boolean
  wheelchairAccessible: boolean
  parkingAvailable: boolean
  crowdLevels: string[]
  maxEntryFee: number
  categories: string[]
}

interface EnhancedFiltersProps {
  pandals: PandalInfo[]
  onFiltersChange: (filters: FilterOptions) => void
  activeFiltersCount: number
}

export const EnhancedFilters = ({ pandals, onFiltersChange, activeFiltersCount }: EnhancedFiltersProps) => {
  const [filters, setFilters] = useState<FilterOptions>({
    themes: [],
    hasAwards: false,
    wheelchairAccessible: false,
    parkingAvailable: false,
    crowdLevels: [],
    maxEntryFee: 1000,
    categories: []
  })

  const [expanded, setExpanded] = useState(false)

  // Extract unique themes from pandals
  const availableThemes = Array.from(
    new Set(pandals.map(p => p.details.theme).filter((theme): theme is string => Boolean(theme)))
  ).sort()

  const crowdLevelOptions = ['low', 'medium', 'high']
  const categoryOptions = ['north', 'south', 'aristocratic', 'salt_lake']

  useEffect(() => {
    onFiltersChange(filters)
  }, [filters, onFiltersChange])

  const handleThemeChange = (theme: string) => {
    setFilters(prev => ({
      ...prev,
      themes: prev.themes.includes(theme)
        ? prev.themes.filter(t => t !== theme)
        : [...prev.themes, theme]
    }))
  }

  const handleCrowdLevelChange = (level: string) => {
    setFilters(prev => ({
      ...prev,
      crowdLevels: prev.crowdLevels.includes(level)
        ? prev.crowdLevels.filter(l => l !== level)
        : [...prev.crowdLevels, level]
    }))
  }

  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      themes: [],
      hasAwards: false,
      wheelchairAccessible: false,
      parkingAvailable: false,
      crowdLevels: [],
      maxEntryFee: 1000,
      categories: []
    })
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.themes.length > 0) count++
    if (filters.hasAwards) count++
    if (filters.wheelchairAccessible) count++
    if (filters.parkingAvailable) count++
    if (filters.crowdLevels.length > 0) count++
    if (filters.maxEntryFee < 1000) count++
    if (filters.categories.length > 0) count++
    return count
  }

  return (
    <Box className="mb-4">
      <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Box className="flex items-center justify-between w-full">
            <Box className="flex items-center gap-2">
              <FilterAlt />
              <Typography variant="h6">Enhanced Filters</Typography>
              {getActiveFiltersCount() > 0 && (
                <Chip 
                  label={`${getActiveFiltersCount()} active`} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box className="space-y-4">
            {/* Theme Filter */}
            {availableThemes.length > 0 && (
              <Box>
                <Typography variant="subtitle2" className="mb-2">Themes</Typography>
                <Box className="flex flex-wrap gap-1">
                  {availableThemes.map(theme => (
                    <Chip
                      key={theme}
                      label={theme}
                      onClick={() => handleThemeChange(theme)}
                      color={filters.themes.includes(theme) ? 'primary' : 'default'}
                      variant={filters.themes.includes(theme) ? 'filled' : 'outlined'}
                      size="small"
                      clickable
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Category Filter */}
            <Box>
              <Typography variant="subtitle2" className="mb-2">Categories</Typography>
              <FormGroup row>
                {categoryOptions.map(category => (
                  <FormControlLabel
                    key={category}
                    control={
                      <Checkbox
                        checked={filters.categories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                        size="small"
                      />
                    }
                    label={category.charAt(0).toUpperCase() + category.slice(1)}
                  />
                ))}
              </FormGroup>
            </Box>

            {/* Crowd Level Filter */}
            <Box>
              <Typography variant="subtitle2" className="mb-2">Crowd Levels</Typography>
              <Box className="flex flex-wrap gap-1">
                {crowdLevelOptions.map(level => (
                  <Chip
                    key={level}
                    label={level.charAt(0).toUpperCase() + level.slice(1)}
                    onClick={() => handleCrowdLevelChange(level)}
                    color={filters.crowdLevels.includes(level) ? 'primary' : 'default'}
                    variant={filters.crowdLevels.includes(level) ? 'filled' : 'outlined'}
                    size="small"
                    clickable
                  />
                ))}
              </Box>
            </Box>

            {/* Accessibility Filters */}
            <Box>
              <Typography variant="subtitle2" className="mb-2">Accessibility</Typography>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.hasAwards}
                      onChange={(e) => setFilters(prev => ({ ...prev, hasAwards: e.target.checked }))}
                      size="small"
                    />
                  }
                  label="Award Winners"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.wheelchairAccessible}
                      onChange={(e) => setFilters(prev => ({ ...prev, wheelchairAccessible: e.target.checked }))}
                      size="small"
                    />
                  }
                  label="Wheelchair Accessible"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.parkingAvailable}
                      onChange={(e) => setFilters(prev => ({ ...prev, parkingAvailable: e.target.checked }))}
                      size="small"
                    />
                  }
                  label="Parking Available"
                />
              </FormGroup>
            </Box>

            {/* Entry Fee Filter */}
            <Box>
              <Typography variant="subtitle2" className="mb-2">Maximum Entry Fee</Typography>
              <FormControl fullWidth size="small">
                <InputLabel>Max Fee</InputLabel>
                <Select
                  value={filters.maxEntryFee}
                  label="Max Fee"
                  onChange={(e) => setFilters(prev => ({ ...prev, maxEntryFee: Number(e.target.value) }))}
                >
                  <MenuItem value={0}>Free</MenuItem>
                  <MenuItem value={100}>₹100</MenuItem>
                  <MenuItem value={250}>₹250</MenuItem>
                  <MenuItem value={500}>₹500</MenuItem>
                  <MenuItem value={1000}>₹1000+</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Clear Filters Button */}
            <Box className="flex justify-end">
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm"
              >
                Clear All Filters
              </button>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}
