import { PandalInfo } from '@/types/types'
import GoogleMapLink from './GoogleMapLink'
import { categoryMap } from '@/constants/constants'

interface PandalInfoPopupProps {
  pandal: PandalInfo
}

export const PandalInfoPopup = ({ pandal }: PandalInfoPopupProps) => {
  const { name, category } = pandal.details
  const { latitude, longitude } = pandal.location

  return (
    <div className='flex gap-2'>
      <div>
        <GoogleMapLink lat={latitude} lng={longitude} />
      </div>
      <div>
        <div className='mb-1'>
          <strong>{name}</strong>
        </div>
        <div className='text-xs'>
          {categoryMap[category as keyof typeof categoryMap]}
        </div>
      </div>
    </div>
  )
}
