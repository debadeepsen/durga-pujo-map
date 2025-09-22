// types.ts

export type Feature = {
  type: 'Feature'
  geometry: {
    type: 'Point'
    coordinates: [number, number] // [lng, lat]
  }
  properties: {
    name: string
    styleUrl?: string
    [key: string]: any
  }
}

export type CategoryKey = keyof typeof import('../constants/constants').categoryMap

export type ClassifiedPujas = {
  [key in CategoryKey]: PandalInfo[]
}

export type PandalInfo = {
  id: number
  location: {
    latitude: number
    longitude: number
  }
  details: {
    name: string
    description: string | { '@type': string; value: string }
    category: string
  }
}
