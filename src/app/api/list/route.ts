import { NextResponse } from 'next/server'
import { pandals } from '@/data/puja_pandals'
import { Feature, ClassifiedPujas } from '@/types/types'

export async function GET() {
  const features = (pandals as any).features as Feature[]

  const result: ClassifiedPujas = {
    'Bonedi Bari Pujo': [],
    'North/Central Kolkata': [],
    'Salt Lake': [],
    'South Kolkata': []
  }

  features.forEach(feature => {
    const [lng, lat] = feature.geometry.coordinates

    // 1. Banedi Bari category
    if (feature.properties?.['icon-color'] === '#0288d1') {
      result['Bonedi Bari Pujo'].push(feature)
      return
    }

    // 2. Rough classification based on lat/lng
    if (lat >= 22.6 && lng < 88.42) {
      result['North/Central Kolkata'].push(feature)
    } else if (lng >= 88.4 && lat >= 22.55 && lat <= 22.62) {
      result['Salt Lake'].push(feature)
    } else {
      result['South Kolkata'].push(feature)
    }
  })

  return NextResponse.json(result)
}
