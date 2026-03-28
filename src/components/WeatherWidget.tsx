'use client'

import { useState, useEffect } from 'react'
import { Box, Typography, Card, CardContent, Chip, Alert, CircularProgress } from '@mui/material'
import { Cloud, Thermostat, WaterDrop, Air, Visibility, Warning, Info } from '@mui/icons-material'
import { WeatherData, WeatherAlert, getSampleWeatherData, getWeatherAlerts, getVisitRecommendation } from '@/utils/weatherService'

interface WeatherWidgetProps {
  location?: {
    lat: number
    lon: number
    name?: string
  }
  showForecast?: boolean
  compact?: boolean
}

export const WeatherWidget = ({ location, showForecast = true, compact = false }: WeatherWidgetProps) => {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [alerts, setAlerts] = useState<WeatherAlert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!location) return

    const loadWeather = async () => {
      setLoading(true)
      try {
        // In real app, use fetchWeatherData
        const weatherData = getSampleWeatherData(location.lat, location.lon)
        setWeather(weatherData)
        setAlerts(getWeatherAlerts(weatherData))
      } catch (error) {
        console.error('Failed to load weather data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadWeather()
  }, [location])

  if (loading) {
    return (
      <Box className="p-4 flex justify-center">
        <CircularProgress size={24} />
      </Box>
    )
  }

  if (!weather) {
    return (
      <Box className="p-4 text-center">
        <Cloud className="text-gray-400 mb-2" />
        <Typography variant="body2" color="textSecondary">
          Weather data unavailable
        </Typography>
      </Box>
    )
  }

  if (compact) {
    return (
      <Box className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <Box className="flex items-center gap-2">
          <Thermostat className="text-blue-500" fontSize="small" />
          <Typography variant="body2" className="font-medium">
            {Math.round(weather.current.temperature)}°C
          </Typography>
        </Box>
        <Box className="flex items-center gap-2">
          <WaterDrop className="text-blue-400" fontSize="small" />
          <Typography variant="caption">
            {weather.current.humidity}%
          </Typography>
        </Box>
        <Typography variant="caption" color="textSecondary">
          {weather.current.condition}
        </Typography>
      </Box>
    )
  }

  return (
    <Box className="space-y-3">
      <Card>
        <CardContent className="p-4">
          <Box className="flex items-center justify-between mb-3">
            <Typography variant="h6" className="flex items-center gap-2">
              <Cloud />
              {weather.location.name} Weather
            </Typography>
            <Chip 
              label={weather.current.condition} 
              size="small" 
              variant="outlined"
            />
          </Box>

          <Box className="grid grid-cols-2 gap-4 mb-4">
            <Box className="flex items-center gap-2">
              <Thermostat className="text-orange-500" />
              <Box>
                <Typography variant="h4" className="font-bold">
                  {Math.round(weather.current.temperature)}°C
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Feels like {Math.round(weather.current.feelsLike)}°C
                </Typography>
              </Box>
            </Box>

            <Box className="space-y-2">
              <Box className="flex items-center gap-2">
                <WaterDrop className="text-blue-400" fontSize="small" />
                <Typography variant="body2">
                  Humidity: {weather.current.humidity}%
                </Typography>
              </Box>
              <Box className="flex items-center gap-2">
                <Air className="text-gray-400" fontSize="small" />
                <Typography variant="body2">
                  Wind: {weather.current.windSpeed.toFixed(1)} km/h
                </Typography>
              </Box>
              <Box className="flex items-center gap-2">
                <Visibility className="text-gray-400" fontSize="small" />
                <Typography variant="body2">
                  Visibility: {weather.current.visibility} km
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <Typography variant="subtitle2" className="font-medium mb-1">
              Visit Recommendation
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {getVisitRecommendation(weather)}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {alerts.length > 0 && (
        <Box className="space-y-2">
          {alerts.map((alert, index) => (
            <Alert 
              key={index}
              severity={alert.type === 'severe' ? 'error' : alert.type === 'warning' ? 'warning' : 'info'}
              icon={alert.type === 'info' ? <Info /> : <Warning />}
              className="text-sm"
            >
              {alert.message}
            </Alert>
          ))}
        </Box>
      )}

      {showForecast && (
        <Card>
          <CardContent className="p-4">
            <Typography variant="h6" className="mb-3">
              5-Day Forecast
            </Typography>
            <Box className="space-y-2">
              {weather.forecast.map((day, index) => (
                <Box key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <Typography variant="body2" className="font-medium">
                    {day.date}
                  </Typography>
                  <Box className="flex items-center gap-3">
                    <Typography variant="body2">
                      {day.condition}
                    </Typography>
                    <Typography variant="body2" className="font-medium">
                      {Math.round(day.maxTemp)}° / {Math.round(day.minTemp)}°
                    </Typography>
                    {day.rainChance > 30 && (
                      <Chip 
                        label={`${Math.round(day.rainChance)}% rain`} 
                        size="small" 
                        color="primary"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}
