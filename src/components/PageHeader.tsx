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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='contact-form-title'
        aria-describedby='contact-form-description'
      >
        <Box
          sx={{
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '95vw', sm: 500 },
            maxHeight: { xs: '95vh', sm: '90vh' },
            bgcolor: 'background.paper',
            borderRadius: 3,
            boxShadow: 24,
            p: { xs: 4, sm: 6 },
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          <Box className='flex justify-between items-center mb-4'>
            <Typography
              id='contact-form-title'
              variant='h6'
              component='h2'
              sx={{ fontWeight: 600 }}
            >
              Contact Us
            </Typography>
            <IconButton onClick={handleClose}>
              <Icon icon='lets-icons:close-round-light' />
            </IconButton>
          </Box>

          <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
            We'd love to hear from you! Please fill out this form and we will
            get back to you shortly.
          </Typography>

          <Box
            component='form'
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            onSubmit={e => {
              e.preventDefault()
              // TODO: handle form submission
              handleClose()
            }}
          >
            <TextField
              label='Name'
              variant='outlined'
              fullWidth
              required
              sx={{ borderRadius: 2 }}
            />
            <TextField
              label='Email'
              type='email'
              variant='outlined'
              fullWidth
              required
              sx={{ borderRadius: 2 }}
            />
            <TextField
              label='Message'
              variant='outlined'
              fullWidth
              required
              multiline
              rows={5}
              sx={{ borderRadius: 2 }}
            />
            <Button
              type='submit'
              variant='contained'
              color='primary'
              sx={{ mt: 1, py: 1.5, fontWeight: 600 }}
            >
              Send Message
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  )
}
