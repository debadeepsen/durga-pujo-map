import { Icon } from '@iconify-icon/react'

export const PageFooter = () => {
  return (
    <div className='p-2 my-2 text-xs'>
      Data collected from{' '}
      <a target='_blank' href='https://www.thepujo.com/pujo-map'>
        The Pujo Company
        <Icon icon='lucide:external-link' />
      </a>{' '}
      and{' '}
      <a target='_blank' href='https://www.durgaonline.com/index.php/gmap'>
        Durga Online
        <Icon icon='lucide:external-link' />
      </a>
      .
    </div>
  )
}
