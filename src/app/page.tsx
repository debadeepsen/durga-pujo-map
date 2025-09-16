'use client'
import dynamic from 'next/dynamic'

// Dynamically load to avoid SSR issues
const PandalMap = dynamic(() => import('@/components/PandalMap'), {
  ssr: false
})

export default function Page() {
  return (
    <main>
      <div className='flex flex-1 items-center border-b border-zinc-600/50 z-10'>
        {/* <img src='/dhak.jpg' className='ml-2' style={{ height: 48 }} /> */}
        <h1 className='text-xl font-semibold h-[48px] flex flex-1 items-center pl-4 text-red-500 dark:text-red-400/90'>
          Durga Puja Pandals Map
        </h1>
      </div>
      <PandalMap />
    </main>
  )
}
