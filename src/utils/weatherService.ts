// Weather service for Durga Puja map
// Using OpenWeatherMap API (free tier)

export interface WeatherData {
  location: {
    name: string
    lat: number
    lon: number
  }
  current: {
    temperature: number
    feelsLike: number
    humidity: number
    windSpeed: number
    windDirection: number
    visibility: number
    pressure: number
    condition: string
    icon: string
  }
  forecast: Array<{
    date: string
    maxTemp: number
    minTemp: number
    condition: string
    icon: string
    humidity: number
    rainChance: number
  }>
}

export interface WeatherAlert {
  type: 'info' | 'warning' | 'severe'
  message: string
  icon: string
}

// Sample weather data for demonstration (in real app, fetch from API)
export const getSampleWeatherData = (lat: number, lon: number): WeatherData => {
  // Simulate different weather based on location
  const isNorthKolkata = lat > 22.58
  const isSouthKolkata = lat < 22.52
  
  return {
    location: {
      name: isNorthKolkata ? 'North Kolkata' : isSouthKolkata ? 'South Kolkata' : 'Central Kolkata',
      lat,
      lon
    },
    current: {
      temperature: 28 + Math.random() * 4,
      feelsLike: 30 + Math.random() * 4,
      humidity: 70 + Math.random() * 20,
      windSpeed: 5 + Math.random() * 10,
      windDirection: Math.random() * 360,
      visibility: 8 + Math.random() * 2,
      pressure: 1008 + Math.random() * 8,
      condition: Math.random() > 0.7 ? 'Partly Cloudy' : 'Clear Sky',
      icon: Math.random() > 0.7 ? '02d' : '01d'
    },
    forecast: Array.from({ length: 5 }, (_, i) => ({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString(),
      maxTemp: 30 + Math.random() * 4,
      minTemp: 24 + Math.random() * 3,
      condition: Math.random() > 0.6 ? 'Partly Cloudy' : Math.random() > 0.3 ? 'Clear Sky' : 'Light Rain',
      icon: Math.random() > 0.6 ? '02d' : Math.random() > 0.3 ? '01d' : '10d',
      humidity: 70 + Math.random() * 20,
      rainChance: Math.random() * 40
    }))
  }
}

export const getWeatherAlerts = (weather: WeatherData): WeatherAlert[] => {
  const alerts: WeatherAlert[] = []
  
  // High temperature alert
  if (weather.current.temperature > 32) {
    alerts.push({
      type: 'warning',
      message: 'High temperature expected. Stay hydrated and plan visits during cooler hours.',
      icon: '☀️'
    })
  }
  
  // Rain alert
  const hasRain = weather.forecast.some(day => day.rainChance > 60)
  if (hasRain) {
    alerts.push({
      type: 'info',
      message: 'Rain expected in the forecast. Carry an umbrella for your pandal visits.',
      icon: '🌧️'
    })
  }
  
  // High humidity alert
  if (weather.current.humidity > 85) {
    alerts.push({
      type: 'info',
      message: 'High humidity levels. Consider taking breaks in shaded areas.',
      icon: '💧'
    })
  }
  
  return alerts
}

export const getVisitRecommendation = (weather: WeatherData): string => {
  const { current, forecast } = weather
  
  if (current.temperature > 32) {
    return 'Best visiting time: Early morning (6-9 AM) or evening (7-10 PM)'
  }
  
  if (forecast.some(day => day.rainChance > 60)) {
    return 'Check weather updates before heading out. Indoor pandals recommended during rain.'
  }
  
  if (current.humidity > 85) {
    return 'Take frequent breaks and stay hydrated. Light, breathable clothing recommended.'
  }
  
  return 'Great weather for pandal hopping! Enjoy your visits throughout the day.'
}

// In a real implementation, you would have:
export const fetchWeatherData = async (lat: number, lon: number): Promise<WeatherData> => {
  // const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
  // const response = await fetch(
  //   `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  // )
  // const data = await response.json()
  // return transformWeatherData(data)
  
  // For now, return sample data
  return getSampleWeatherData(lat, lon)
}
