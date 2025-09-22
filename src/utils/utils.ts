import { ClassifiedPujas, PandalInfo } from '@/types/types'

export const getCategorizedData = (data: PandalInfo[]) => {
  const categorizedData: ClassifiedPujas = {
    aristocratic: [],
    north: [],
    salt_lake: [],
    south: []
  }
  data.forEach(pandal => {
    const { category } = pandal.details
    categorizedData[category as keyof ClassifiedPujas].push(pandal)
  })
  return categorizedData
}
