'use client'

import React from 'react'
import { Modal, Box, Typography, TextField, Button, IconButton } from '@mui/material'
import { Icon } from '@iconify-icon/react'

type ContactModalProps = {
  open: boolean
  onClose: () => void
}

export const ContactModal: React.FC<ContactModalProps> = ({ open, onClose }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby='contact-form-title'
      aria-describedby='contact-form-description'
    >
      <Box
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] sm:w-96 max-h-[95vh] sm:max-h-[90vh] bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-y-auto flex flex-col gap-4 backdrop-blur-md transition-colors"
      >
        {/* Header */}
        <Box className="flex justify-between items-center mb-4">
          <Typography
            id='contact-form-title'
            variant='h6'
            component='h2'
            className="font-semibold text-gray-900 dark:text-gray-100"
          >
            Contact Us
          </Typography>
          <IconButton onClick={onClose} className="text-gray-700 dark:text-gray-300">
            <Icon icon='mdi:close' />
          </IconButton>
        </Box>

        {/* Description */}
        <Typography
          variant='body2'
          className="text-gray-700 dark:text-gray-300 mb-2"
        >
          We'd love to hear from you! Please fill out this form and we will get back to you shortly.
        </Typography>

        {/* Form */}
        <Box
          component='form'
          className="flex flex-col gap-3"
          onSubmit={e => {
            e.preventDefault()
            // TODO: handle submission
            onClose()
          }}
        >
          <TextField
            label='Name'
            variant='outlined'
            fullWidth
            required
            className="bg-white dark:bg-gray-800 rounded-md"
            InputLabelProps={{ className: 'text-gray-900 dark:text-gray-100' }}
            InputProps={{ className: 'text-gray-900 dark:text-gray-100' }}
          />
          <TextField
            label='Email'
            type='email'
            variant='outlined'
            fullWidth
            required
            className="bg-white dark:bg-gray-800 rounded-md"
            InputLabelProps={{ className: 'text-gray-900 dark:text-gray-100' }}
            InputProps={{ className: 'text-gray-900 dark:text-gray-100' }}
          />
          <TextField
            label='Message'
            variant='outlined'
            fullWidth
            required
            multiline
            rows={5}
            className="bg-white dark:bg-gray-800 rounded-md"
            InputLabelProps={{ className: 'text-gray-900 dark:text-gray-100' }}
            InputProps={{ className: 'text-gray-900 dark:text-gray-100' }}
          />
          <Button
            type='submit'
            variant='contained'
            color='primary'
            className="mt-2 py-2 font-semibold"
          >
            Send Message
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
