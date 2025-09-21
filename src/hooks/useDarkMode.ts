import { useEffect, useState } from 'react'

// Detects if dark mode is active (Tailwind supports 'media' or 'class' strategy)
export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const root = window.document.documentElement

    const checkDark = () => {
      // Tailwind 'class' strategy: check if <html> has .dark
      if (root.classList.contains('dark')) {
        return true
      }
      // Tailwind 'media' strategy: check prefers-color-scheme
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }

    const update = () => setIsDark(checkDark())

    update()

    // Listen to system preference changes
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    media.addEventListener('change', update)

    // Also observe class changes on <html> for class-based dark mode
    const observer = new MutationObserver(update)
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })

    return () => {
      media.removeEventListener('change', update)
      observer.disconnect()
    }
  }, [])

  return isDark
}

// ----------------------
// Example usage
// ----------------------
/*
import React from 'react'
import { useDarkMode } from './useDarkMode'

const Page = () => {
  const isDark = useDarkMode()

  return (
    <div className="p-6">
      <p>Dark mode is {isDark ? 'enabled' : 'disabled'} ✅</p>
    </div>
  )
}

export default Page
*/
