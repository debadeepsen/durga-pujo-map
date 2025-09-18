'use client'

import { Icon } from '@iconify-icon/react'

type GoogleMapLinkProps = {
  lat: number
  lng: number
  size?: number
}

const GoogleMapLink = ({ lat, lng, size = 18 }: GoogleMapLinkProps) => {
  return (
    <a
      href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
      target='_blank'
      rel='noopener noreferrer'
      title='Open in Google Maps'
      onClick={e => e.stopPropagation()} // prevent triggering parent events like recenter
    >
      <Icon
        icon='logos:google-maps'
        width={size}
        height={size}
        className='relative top-1'
      />
    </a>
  )
}

export default GoogleMapLink
