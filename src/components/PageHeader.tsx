'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton
} from '@mui/material'
import { Icon } from '@iconify-icon/react'
import { ContactModal } from './ContactForm'

export const PageHeader = () => {
  const pathname = usePathname()
  const isAboutPage = pathname === '/about'
  const linkText = isAboutPage ? 'Home' : 'About'
  const linkHref = isAboutPage ? '/' : '/about'

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <div className='flex flex-1 items-center border-b border-zinc-600/50 z-10 relative'>
      <h1 className='text-xl font-semibold h-[48px] flex flex-1 items-center pl-12 relative -top-[1px]'>
        Durga Puja Pandals Map
      </h1>

      <nav className='pr-12 flex items-center gap-4'>
        <Link
          href={linkHref}
          className='text-sm font-medium text-blue-600 hover:text-blue-800'
        >
          {linkText}
        </Link>

        <Button
          variant='contained'
          color='primary'
          size='small'
          onClick={handleOpen}
        >
          Contact
        </Button>
      </nav>

      {/* Contact Modal */}
      <ContactModal open={open} onClose={handleClose} />
    </div>
  )
}
