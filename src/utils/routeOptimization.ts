import { PandalInfo } from '@/types/types'

export interface RoutePoint {
  id: number
  latitude: number
  longitude: number
  name: string
}

export interface OptimizedRoute {
  waypoints: RoutePoint[]
  totalDistance: number
  estimatedTime: number
}

// Calculate distance between two points using Haversine formula
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Create distance matrix for selected pandals
export function createDistanceMatrix(pandals: PandalInfo[]): number[][] {
  const n = pandals.length
  const matrix: number[][] = Array(n).fill(null).map(() => Array(n).fill(0))
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        const p1 = pandals[i].location
        const p2 = pandals[j].location
        matrix[i][j] = calculateDistance(p1.latitude, p1.longitude, p2.latitude, p2.longitude)
      }
    }
  }
  
  return matrix
}

// Simple Nearest Neighbor algorithm for route optimization (faster than ACO)
export function optimizeRouteNearestNeighbor(pandals: PandalInfo[]): OptimizedRoute {
  if (pandals.length <= 1) {
    return {
      waypoints: pandals.map(p => ({
        id: p.id,
        latitude: p.location.latitude,
        longitude: p.location.longitude,
        name: p.details.name
      })),
      totalDistance: 0,
      estimatedTime: 0
    }
  }

  const distanceMatrix = createDistanceMatrix(pandals)
  const n = pandals.length
  const visited = new Set<number>()
  const route: number[] = [0] // Start from first pandal
  visited.add(0)
  
  while (visited.size < n) {
    const current = route[route.length - 1]
    let nearest = -1
    let minDistance = Infinity
    
    for (let i = 0; i < n; i++) {
      if (!visited.has(i) && distanceMatrix[current][i] < minDistance) {
        minDistance = distanceMatrix[current][i]
        nearest = i
      }
    }
    
    if (nearest !== -1) {
      route.push(nearest)
      visited.add(nearest)
    }
  }
  
  // Calculate total distance
  let totalDistance = 0
  for (let i = 0; i < route.length - 1; i++) {
    totalDistance += distanceMatrix[route[i]][route[i + 1]]
  }
  
  // Estimate time (assuming average speed of 20 km/h and 30 min visit per pandal)
  const travelTime = (totalDistance / 20) * 60 // minutes
  const visitTime = pandals.length * 30 // 30 minutes per pandal
  const estimatedTime = travelTime + visitTime
  
  const waypoints = route.map(index => ({
    id: pandals[index].id,
    latitude: pandals[index].location.latitude,
    longitude: pandals[index].location.longitude,
    name: pandals[index].details.name
  }))
  
  return {
    waypoints,
    totalDistance,
    estimatedTime
  }
}

// ACO implementation for more complex optimization
export interface ACOConfig {
  numAnts: number
  numIterations: number
  alpha: number // Pheromone importance
  beta: number  // Heuristic information importance
  rho: number   // Pheromone evaporation rate
  q: number     // Pheromone deposit factor
}

export function optimizeRouteACO(pandals: PandalInfo[], config: Partial<ACOConfig> = {}): OptimizedRoute {
  const finalConfig: ACOConfig = {
    numAnts: 10,
    numIterations: 100,
    alpha: 1,
    beta: 2,
    rho: 0.1,
    q: 100,
    ...config
  }

  if (pandals.length <= 1) {
    return optimizeRouteNearestNeighbor(pandals)
  }

  const distanceMatrix = createDistanceMatrix(pandals)
  const n = pandals.length
  
  // Initialize pheromone matrix
  const pheromone: number[][] = Array(n).fill(null).map(() => Array(n).fill(1))
  
  let bestRoute: number[] = []
  let bestDistance = Infinity
  
  for (let iteration = 0; iteration < finalConfig.numIterations; iteration++) {
    const antRoutes: number[][] = []
    const antDistances: number[] = []
    
    // Each ant builds a route
    for (let ant = 0; ant < finalConfig.numAnts; ant++) {
      const route = [Math.floor(Math.random() * n)] // Random starting point
      const visited = new Set(route)
      
      while (visited.size < n) {
        const current = route[route.length - 1]
        const probabilities: number[] = []
        const unvisited: number[] = []
        
        // Calculate probabilities for next move
        for (let i = 0; i < n; i++) {
          if (!visited.has(i)) {
            unvisited.push(i)
            const pheromoneLevel = Math.pow(pheromone[current][i], finalConfig.alpha)
            const heuristic = Math.pow(1 / distanceMatrix[current][i], finalConfig.beta)
            probabilities.push(pheromoneLevel * heuristic)
          } else {
            probabilities.push(0)
          }
        }
        
        // Select next city based on probabilities
        const totalProb = probabilities.reduce((sum, p) => sum + p, 0)
        if (totalProb > 0) {
          let random = Math.random() * totalProb
          let nextCity = -1
          
          for (let i = 0; i < n; i++) {
            if (!visited.has(i)) {
              random -= probabilities[i]
              if (random <= 0) {
                nextCity = i
                break
              }
            }
          }
          
          if (nextCity !== -1) {
            route.push(nextCity)
            visited.add(nextCity)
          }
        }
      }
      
      antRoutes.push(route)
      
      // Calculate route distance
      let distance = 0
      for (let i = 0; i < route.length - 1; i++) {
        distance += distanceMatrix[route[i]][route[i + 1]]
      }
      antDistances.push(distance)
      
      // Update best route
      if (distance < bestDistance) {
        bestDistance = distance
        bestRoute = [...route]
      }
    }
    
    // Update pheromone levels
    // Evaporation
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        pheromone[i][j] *= (1 - finalConfig.rho)
      }
    }
    
    // Deposit pheromone
    for (let ant = 0; ant < finalConfig.numAnts; ant++) {
      const route = antRoutes[ant]
      const distance = antDistances[ant]
      const deposit = finalConfig.q / distance
      
      for (let i = 0; i < route.length - 1; i++) {
        pheromone[route[i]][route[i + 1]] += deposit
        pheromone[route[i + 1]][route[i]] += deposit
      }
    }
  }
  
  // Calculate final route details
  const waypoints = bestRoute.map(index => ({
    id: pandals[index].id,
    latitude: pandals[index].location.latitude,
    longitude: pandals[index].location.longitude,
    name: pandals[index].details.name
  }))
  
  // Estimate time
  const travelTime = (bestDistance / 20) * 60 // minutes
  const visitTime = pandals.length * 30
  const estimatedTime = travelTime + visitTime
  
  return {
    waypoints,
    totalDistance: bestDistance,
    estimatedTime
  }
}
