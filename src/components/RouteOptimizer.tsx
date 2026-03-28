'use client'

import { useState, useEffect } from 'react'
import { PandalInfo } from '@/types/types'
import { optimizeRouteNearestNeighbor, optimizeRouteACO, OptimizedRoute, RoutePoint } from '@/utils/routeOptimization'
import { Button, Switch, FormControlLabel, CircularProgress, Typography, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import { ExpandMore, Route, AccessTime, Directions } from '@mui/icons-material'

interface RouteOptimizerProps {
  selectedPandals: PandalInfo[]
  onRouteGenerated?: (route: OptimizedRoute) => void
}

export const RouteOptimizer = ({ selectedPandals, onRouteGenerated }: RouteOptimizerProps) => {
  const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRoute | null>(null)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [useACO, setUseACO] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    if (selectedPandals.length <= 1) {
      setOptimizedRoute(null)
      return
    }
  }, [selectedPandals])

  const handleOptimize = async () => {
    if (selectedPandals.length <= 1) return

    setIsOptimizing(true)
    
    try {
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const route = useACO 
        ? optimizeRouteACO(selectedPandals)
        : optimizeRouteNearestNeighbor(selectedPandals)
      
      setOptimizedRoute(route)
      onRouteGenerated?.(route)
    } catch (error) {
      console.error('Route optimization failed:', error)
    } finally {
      setIsOptimizing(false)
    }
  }

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = Math.round(minutes % 60)
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const formatDistance = (km: number): string => {
    return `${km.toFixed(1)} km`
  }

  if (selectedPandals.length <= 1) {
    return null
  }

  return (
    <Box className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4">
      <Typography variant="h6" className="mb-3 flex items-center gap-2">
        <Route />
        Route Optimizer
      </Typography>
      
      <div className="flex items-center justify-between mb-3">
        <FormControlLabel
          control={
            <Switch
              checked={useACO}
              onChange={(e) => setUseACO(e.target.checked)}
              size="small"
            />
          }
          label="Advanced Algorithm (ACO)"
        />
        
        <Button
          variant="contained"
          onClick={handleOptimize}
          disabled={isOptimizing}
          startIcon={isOptimizing ? <CircularProgress size={16} /> : <Directions />}
          size="small"
        >
          {isOptimizing ? 'Optimizing...' : 'Optimize Route'}
        </Button>
      </div>

      {optimizedRoute && (
        <div className="space-y-3">
          <div className="flex justify-around text-center p-3 bg-white dark:bg-gray-700 rounded">
            <div>
              <Typography variant="body2" color="textSecondary">
                Total Distance
              </Typography>
              <Typography variant="h6" color="primary">
                {formatDistance(optimizedRoute.totalDistance)}
              </Typography>
            </div>
            <div>
              <Typography variant="body2" color="textSecondary">
                Est. Time
              </Typography>
              <Typography variant="h6" color="primary" className="flex items-center gap-1">
                <AccessTime fontSize="small" />
                {formatTime(optimizedRoute.estimatedTime)}
              </Typography>
            </div>
          </div>

          <Button
            variant="outlined"
            onClick={() => setShowDetails(!showDetails)}
            size="small"
            className="w-full"
          >
            {showDetails ? 'Hide' : 'Show'} Route Details
          </Button>

          {showDetails && (
            <Accordion expanded={true}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle1">Optimized Route Order</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="space-y-2">
                  {optimizedRoute.waypoints.map((point, index) => (
                    <div key={point.id} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-600 rounded">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <Typography variant="body2" className="font-medium">
                          {point.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          ID: {point.id}
                        </Typography>
                      </div>
                      {index < optimizedRoute.waypoints.length - 1 && (
                        <Typography variant="caption" color="primary">
                          → {formatDistance(
                            calculateDistance(
                              point.latitude, point.longitude,
                              optimizedRoute.waypoints[index + 1].latitude,
                              optimizedRoute.waypoints[index + 1].longitude
                            )
                          )}
                        </Typography>
                      )}
                    </div>
                  ))}
                </div>
              </AccordionDetails>
            </Accordion>
          )}
        </div>
      )}
    </Box>
  )
}

// Helper function for distance calculation (duplicate from routeOptimization.ts)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}
