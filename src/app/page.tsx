'use client'
import dynamic from 'next/dynamic'

// Dynamically load to avoid SSR issues
const PandalMap = dynamic(() => import('@/components/PandalMap'), {
  ssr: false
})

export default function Page() {
  return (
    <main>
      <PandalMap />
    </main>
  )
}
