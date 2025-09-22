import type { Metadata } from 'next'
import './globals.css'
import 'leaflet/dist/leaflet.css'
import { PageHeader } from '@/components/PageHeader'
import ReduxProvider from '@/providers/ReduxProvider'

export const metadata: Metadata = {
  title: 'Kolkata Durga Pujo Map',
  description: 'Interactive map with markers for Durga Pujo'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <ReduxProvider>
      <head>
        <link
          rel='stylesheet'
          href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
          integrity='sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
          crossOrigin='anonymous'
        />
      </head>
      <body>
        <PageHeader />
        {children}
      </body>
      </ReduxProvider>
    </html>
  )
}
