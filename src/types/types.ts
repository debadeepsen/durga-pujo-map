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

export type ClassifiedPujas = {
  'Aristocratic (Bonedi) Family Pujas': Feature[]
  'North/Central Kolkata': Feature[]
  'Salt Lake': Feature[]
  'South Kolkata': Feature[]
}

export type PandalInfo = {
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
