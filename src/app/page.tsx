'use client'
import dynamic from 'next/dynamic'

// Dynamically load to avoid SSR issues
const PandalMap = dynamic(() => import('@/components/PandalMap'), {
  ssr: false
})

export default function Page() {
  return (
    <main className='p-4'>
      <h1 className='text-xl font-bold mb-4'>Durga Puja Pandals Map</h1>
      <PandalMap />
    </main>
  )
}
