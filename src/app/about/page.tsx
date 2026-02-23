'use client'

import React from 'react'
import Image from 'next/image'
import { Icon } from '@iconify-icon/react'

type Contributor = {
  name: string
  photo: string
  role?: string
  bio?: string
  linkedin?: string
}

const AboutPage = () => {
  const contributors: Contributor[] = React.useMemo(() => {
    try {
      return JSON.parse(process.env.NEXT_PUBLIC_CONTRIBUTORS || '[]')
    } catch {
      return []
    }
  }, [])

  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800 min-h-screen transition-colors">
      {/* Hero Section */}
      <section className="py-12 px-6 sm:px-12 md:px-20 flex flex-col items-center text-center">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-10 backdrop-blur-md">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            About Our Team
          </h1>
          <div className="w-24 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full mb-6 mx-auto"></div>
          <p className="text-gray-700 dark:text-gray-300 text-lg sm:text-xl leading-relaxed">
            We are a passionate team of developers and designers creating the
            Durga Puja Pandals Map — making cultural events more accessible and
            interactive. Our contributors bring expertise in full-stack
            development, UI/UX design, and data visualization.
          </p>
        </div>
      </section>

      {/* Contributors Grid */}
      <section className="py-16 px-6 sm:px-12 md:px-20">
        <div className="flex flex-wrap justify-center gap-8">
          {contributors.map(c => (
            <div
              key={c.name}
              className="relative w-full sm:w-96 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-2xl p-6 flex flex-col items-center text-center transform transition hover:scale-105 hover:shadow-3xl backdrop-blur-md"
            >
              <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden ring-2 ring-indigo-500 dark:ring-indigo-400">
                <Image src={c.photo} alt={c.name} fill className="object-cover" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {c.name}
              </h2>
              {c.role && (
                <p className="text-indigo-600 dark:text-indigo-400 text-sm mt-1 font-medium">
                  {c.role}
                </p>
              )}
              {c.bio && (
                <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">
                  {c.bio}
                </p>
              )}
              {c.linkedin && (
                <a
                  href={c.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                >
                  <Icon icon="mdi:linkedin" className="mr-2" /> LinkedIn
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <section className="text-center py-12 bg-gray-100 dark:bg-gray-900 transition-colors">
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Durga Puja Pandals Map. All rights reserved.
        </p>
      </section>
    </div>
  )
}

export default AboutPage
