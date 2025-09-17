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
  'Banedi Bari': Feature[]
  'North/Central Kolkata': Feature[]
  'Salt Lake': Feature[]
  'South Kolkata': Feature[]
}
