type DrawerProps = {
  open: boolean
  onClose: () => void
  size?: string | number
  children?: React.ReactNode
}

export const Drawer = ({
  open,
  onClose,
  size = 320,
  children
}: DrawerProps) => {
  return (
    <div
      className='absolute inset-0 z-50 overflow-y-auto overflow-x-visible bg-white/90 dark:bg-gray-800/90 transition-transform duration-200 ease-in-out'
      style={{ width: size, transform: `translateX(${open ? 0 : -100}%)` }}
    >
      <button onClick={onClose} className='absolute top-2 right-4 w-2 h-2 flex justify-center items-center bg-gray-500/20 rounded-full'>
        &times;
      </button>
      {children}
    </div>
  )
}
