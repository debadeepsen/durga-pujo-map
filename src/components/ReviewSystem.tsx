'use client'

import { useState } from 'react'
import { Box, Typography, Rating, Button, TextField, Modal, Backdrop, Fade, Chip, Avatar, IconButton, Paper } from '@mui/material'
import { Star, ThumbUp, ThumbDown, RateReview, Person } from '@mui/icons-material'
import { Review, RatingSummary, UserReview } from '@/types/reviews'
import { getReviewsByPandal, getRatingSummary, addReview, updateReviewHelpfulness } from '@/utils/reviewService'

interface ReviewSystemProps {
  pandalId: number
  pandalName: string
  compact?: boolean
}

export const ReviewSystem = ({ pandalId, pandalName, compact = false }: ReviewSystemProps) => {
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [showAddReview, setShowAddReview] = useState(false)
  const [newReview, setNewReview] = useState<UserReview>({
    rating: 5,
    title: '',
    comment: ''
  })

  const reviews = getReviewsByPandal(pandalId)
  const ratingSummary = getRatingSummary(pandalId)

  const handleSubmitReview = () => {
    if (!newReview.title.trim() || !newReview.comment.trim()) return

    addReview(pandalId, {
      userId: 'current_user', // In real app, get from auth
      userName: 'Current User',
      rating: newReview.rating,
      title: newReview.title,
      comment: newReview.comment
    })

    setNewReview({ rating: 5, title: '', comment: '' })
    setShowAddReview(false)
  }

  const renderStars = (rating: number, size: 'small' | 'medium' | 'large' = 'small') => {
    return (
      <Rating
        value={rating}
        readOnly
        size={size}
        precision={0.1}
        className="text-yellow-500"
      />
    )
  }

  if (compact) {
    return (
      <Box className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <Box className="flex items-center gap-3">
          {renderStars(ratingSummary.averageRating, 'small')}
          <Typography variant="body2" className="font-medium">
            {ratingSummary.averageRating > 0 ? ratingSummary.averageRating.toFixed(1) : 'No ratings'}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            ({ratingSummary.totalReviews} reviews)
          </Typography>
        </Box>
        <Button
          size="small"
          onClick={() => setShowAllReviews(!showAllReviews)}
          className="text-blue-500"
        >
          {showAllReviews ? 'Hide' : 'View'}
        </Button>
      </Box>
    )
  }

  return (
    <Box className="space-y-4">
      {/* Rating Summary */}
      <Paper className="p-4">
        <Typography variant="h6" className="mb-3 flex items-center gap-2">
          <RateReview />
          Reviews & Ratings
        </Typography>
        
        <Box className="flex items-center gap-4 mb-3">
          <Box className="text-center">
            <Typography variant="h3" className="font-bold text-blue-600">
              {ratingSummary.averageRating > 0 ? ratingSummary.averageRating.toFixed(1) : '-'}
            </Typography>
            {renderStars(ratingSummary.averageRating, 'medium')}
            <Typography variant="caption" color="textSecondary">
              {ratingSummary.totalReviews} reviews
            </Typography>
          </Box>
          
          <Box className="flex-1 space-y-1">
            {[5, 4, 3, 2, 1].map(stars => (
              <Box key={stars} className="flex items-center gap-2">
                <Typography variant="caption" className="w-8">
                  {stars}★
                </Typography>
                <Box className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <Box
                    className="bg-yellow-500 h-full"
                    style={{
                      width: `${ratingSummary.totalReviews > 0 
                        ? (ratingSummary.ratingDistribution[stars as keyof typeof ratingSummary.ratingDistribution] / ratingSummary.totalReviews) * 100 
                        : 0}%`
                    }}
                  />
                </Box>
                <Typography variant="caption" className="w-8 text-right">
                  {ratingSummary.ratingDistribution[stars as keyof typeof ratingSummary.ratingDistribution]}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Button
          variant="contained"
          onClick={() => setShowAddReview(true)}
          className="w-full"
          startIcon={<RateReview />}
        >
          Write a Review
        </Button>
      </Paper>

      {/* Reviews List */}
      {reviews.length > 0 && (
        <Box className="space-y-3">
          <Typography variant="subtitle1">
            Recent Reviews
          </Typography>
          
          {reviews.slice(0, showAllReviews ? reviews.length : 2).map(review => (
            <Paper key={review.id} className="p-4">
              <Box className="flex items-start justify-between mb-2">
                <Box className="flex items-center gap-2">
                  <Avatar className="w-8 h-8 bg-blue-500">
                    <Person fontSize="small" />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" className="font-medium">
                      {review.userName}
                    </Typography>
                    {renderStars(review.rating, 'small')}
                  </Box>
                </Box>
                {review.isVerified && (
                  <Chip label="Verified" size="small" color="primary" variant="outlined" />
                )}
              </Box>
              
              <Typography variant="h6" className="mb-1">
                {review.title}
              </Typography>
              
              <Typography variant="body2" color="textSecondary" className="mb-2">
                {review.comment}
              </Typography>
              
              <Box className="flex items-center justify-between">
                <Typography variant="caption" color="textSecondary">
                  {new Date(review.createdAt).toLocaleDateString()}
                </Typography>
                <Box className="flex items-center gap-2">
                  <IconButton
                    size="small"
                    onClick={() => updateReviewHelpfulness(review.id, true)}
                    className="text-green-600"
                  >
                    <ThumbUp fontSize="small" />
                  </IconButton>
                  <Typography variant="caption">{review.helpful}</Typography>
                  <IconButton
                    size="small"
                    onClick={() => updateReviewHelpfulness(review.id, false)}
                    className="text-red-600"
                  >
                    <ThumbDown fontSize="small" />
                  </IconButton>
                  <Typography variant="caption">{review.notHelpful}</Typography>
                </Box>
              </Box>
            </Paper>
          ))}
          
          {reviews.length > 2 && !showAllReviews && (
            <Button
              onClick={() => setShowAllReviews(true)}
              className="w-full"
            >
              Show All Reviews ({reviews.length - 2} more)
            </Button>
          )}
        </Box>
      )}

      {/* Add Review Modal */}
      <Modal
        open={showAddReview}
        onClose={() => setShowAddReview(false)}
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
        className="flex items-center justify-center p-4"
      >
        <Fade in={showAddReview}>
          <Paper className="w-full max-w-md p-6">
            <Typography variant="h6" className="mb-4">
              Write a Review for {pandalName}
            </Typography>
            
            <Box className="space-y-4">
              <Box>
                <Typography variant="subtitle2" className="mb-2">
                  Rating
                </Typography>
                <Rating
                  value={newReview.rating}
                  onChange={(_, value) => setNewReview(prev => ({ ...prev, rating: value || 5 }))}
                  size="large"
                />
              </Box>
              
              <TextField
                fullWidth
                label="Review Title"
                value={newReview.title}
                onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                variant="outlined"
                size="small"
              />
              
              <TextField
                fullWidth
                label="Your Review"
                multiline
                rows={4}
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                variant="outlined"
                size="small"
              />
              
              <Box className="flex gap-2">
                <Button
                  variant="contained"
                  onClick={handleSubmitReview}
                  disabled={!newReview.title.trim() || !newReview.comment.trim()}
                  className="flex-1"
                >
                  Submit Review
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setShowAddReview(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Modal>
    </Box>
  )
}
