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
      className='p-3 absolute inset-0 z-50 overflow-y-auto overflow-x-visible bg-white/90 dark:bg-gray-800/90 transition-transform duration-200 ease-in-out'
      style={{ width: size, transform: `translateX(${open ? 0 : -100}%)` }}
    >
      <button onClick={onClose} className='text-lg absolute top-3 right-4 w-3 h-3 flex justify-center items-center bg-gray-500/20 rounded-full'>
        &times;
      </button>
      {children}
    </div>
  )
}
