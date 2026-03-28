'use client'

import { useState } from 'react'
import { Box, Typography, Modal, Backdrop, Fade, IconButton, ImageList, ImageListItem, ImageListItemBar } from '@mui/material'
import { Close, ZoomIn, PhotoCamera } from '@mui/icons-material'

interface Photo {
  id: string
  url: string
  caption?: string
  author?: string
  date?: string
}

interface PhotoGalleryProps {
  pandalId: number
  pandalName: string
  photos?: Photo[]
}

// Sample photos - in real app, these would come from API or database
const samplePhotos: Record<number, Photo[]> = {
  1: [
    { id: '1-1', url: 'https://picsum.photos/seed/durga1/400/300.jpg', caption: 'Main entrance view', author: 'User1', date: '2024-10-15' },
    { id: '1-2', url: 'https://picsum.photos/seed/durga2/400/300.jpg', caption: 'Idol close-up', author: 'User2', date: '2024-10-16' },
    { id: '1-3', url: 'https://picsum.photos/seed/durga3/400/300.jpg', caption: 'Artistic lighting', author: 'User3', date: '2024-10-17' },
  ],
  2: [
    { id: '2-1', url: 'https://picsum.photos/seed/puja1/400/300.jpg', caption: 'Traditional decoration', author: 'User4', date: '2024-10-15' },
    { id: '2-2', url: 'https://picsum.photos/seed/puja2/400/300.jpg', caption: 'Cultural program', author: 'User5', date: '2024-10-16' },
  ]
}

export const PhotoGallery = ({ pandalId, pandalName, photos }: PhotoGalleryProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [open, setOpen] = useState(false)

  const galleryPhotos = photos || samplePhotos[pandalId] || []

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedPhoto(null)
  }

  if (galleryPhotos.length === 0) {
    return (
      <Box className="p-4 text-center">
        <PhotoCamera className="text-gray-400 mb-2" />
        <Typography variant="body2" color="textSecondary">
          No photos available for {pandalName}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          Be the first to add photos!
        </Typography>
      </Box>
    )
  }

  return (
    <Box className="p-4">
      <Typography variant="h6" className="mb-3">
        Photo Gallery ({galleryPhotos.length})
      </Typography>
      
      <ImageList cols={2} gap={8}>
        {galleryPhotos.map((photo) => (
          <ImageListItem key={photo.id} className="cursor-pointer">
            <img
              src={photo.url}
              alt={photo.caption || 'Gallery photo'}
              loading="lazy"
              onClick={() => handlePhotoClick(photo)}
              className="w-full h-32 object-cover rounded-lg hover:opacity-90 transition-opacity"
            />
            <ImageListItemBar
              title={photo.caption}
              subtitle={photo.author}
              actionIcon={
                <IconButton
                  onClick={() => handlePhotoClick(photo)}
                  className="text-white"
                >
                  <ZoomIn />
                </IconButton>
              }
            />
          </ImageListItem>
        ))}
      </ImageList>

      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        className="flex items-center justify-center"
      >
        <Fade in={open}>
          <Box className="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-4xl max-h-[90vh] overflow-auto relative">
            <IconButton
              onClick={handleClose}
              className="absolute top-2 right-2 z-10 bg-white dark:bg-gray-700"
            >
              <Close />
            </IconButton>
            
            {selectedPhoto && (
              <Box className="space-y-4">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.caption || 'Gallery photo'}
                  className="w-full rounded-lg"
                />
                
                <Box className="space-y-2">
                  {selectedPhoto.caption && (
                    <Typography variant="h6">
                      {selectedPhoto.caption}
                    </Typography>
                  )}
                  
                  <Box className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    {selectedPhoto.author && (
                      <Typography variant="body2">
                        By: {selectedPhoto.author}
                      </Typography>
                    )}
                    {selectedPhoto.date && (
                      <Typography variant="body2">
                        {selectedPhoto.date}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </Fade>
      </Modal>
    </Box>
  )
}

// Compact version for popup
export const CompactPhotoGallery = ({ pandalId, pandalName, photos }: PhotoGalleryProps) => {
  const [showFullGallery, setShowFullGallery] = useState(false)
  const galleryPhotos = photos || samplePhotos[pandalId] || []

  if (galleryPhotos.length === 0) {
    return null
  }

  return (
    <Box className="mt-3">
      <Box className="flex items-center justify-between mb-2">
        <Typography variant="subtitle2" className="flex items-center gap-1">
          <PhotoCamera fontSize="small" />
          Photos ({galleryPhotos.length})
        </Typography>
        <button
          onClick={() => setShowFullGallery(!showFullGallery)}
          className="text-blue-500 hover:text-blue-600 text-sm"
        >
          {showFullGallery ? 'Hide' : 'View All'}
        </button>
      </Box>
      
      {!showFullGallery && (
        <Box className="flex gap-2 overflow-x-auto pb-2">
          {galleryPhotos.slice(0, 3).map((photo) => (
            <img
              key={photo.id}
              src={photo.url}
              alt={photo.caption || 'Gallery photo'}
              className="w-20 h-20 object-cover rounded flex-shrink-0"
            />
          ))}
          {galleryPhotos.length > 3 && (
            <Box className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center flex-shrink-0">
              <Typography variant="caption">+{galleryPhotos.length - 3}</Typography>
            </Box>
          )}
        </Box>
      )}
      
      {showFullGallery && (
        <PhotoGallery pandalId={pandalId} pandalName={pandalName} photos={galleryPhotos} />
      )}
    </Box>
  )
}
