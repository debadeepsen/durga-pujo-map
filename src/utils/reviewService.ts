import { Review, RatingSummary } from '@/types/reviews'

// Sample reviews data - in real app, this would come from a database
const sampleReviews: Review[] = [
  {
    id: '1',
    pandalId: 1,
    userId: 'user1',
    userName: 'Rahul S.',
    rating: 5,
    title: 'Amazing traditional theme!',
    comment: 'Beautiful idol and traditional decorations. The lighting was spectacular. Must visit during Durga Puja.',
    helpful: 12,
    notHelpful: 1,
    createdAt: '2024-10-15T10:30:00Z',
    isVerified: true
  },
  {
    id: '2',
    pandalId: 1,
    userId: 'user2',
    userName: 'Priya M.',
    rating: 4,
    title: 'Great but crowded',
    comment: 'Excellent artwork and theme, but gets very crowded in the evenings. Best to visit during afternoon.',
    helpful: 8,
    notHelpful: 2,
    createdAt: '2024-10-14T18:45:00Z',
    isVerified: true
  },
  {
    id: '3',
    pandalId: 2,
    userId: 'user3',
    userName: 'Aniket D.',
    rating: 3,
    title: 'Average experience',
    comment: 'Theme was okay but nothing exceptional. Parking is a problem here.',
    helpful: 5,
    notHelpful: 3,
    createdAt: '2024-10-13T20:15:00Z',
    isVerified: false
  }
]

export const getReviewsByPandal = (pandalId: number): Review[] => {
  return sampleReviews.filter(review => review.pandalId === pandalId)
}

export const getRatingSummary = (pandalId: number): RatingSummary => {
  const reviews = getReviewsByPandal(pandalId)
  
  if (reviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    }
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
  const averageRating = totalRating / reviews.length

  const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.forEach(review => {
    ratingDistribution[review.rating as keyof typeof ratingDistribution]++
  })

  return {
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews: reviews.length,
    ratingDistribution
  }
}

export const addReview = (pandalId: number, review: {
  userId: string
  userName: string
  rating: number
  title: string
  comment: string
}): Review => {
  const newReview: Review = {
    id: `review_${Date.now()}`,
    pandalId,
    userId: review.userId,
    userName: review.userName,
    rating: review.rating,
    title: review.title,
    comment: review.comment,
    helpful: 0,
    notHelpful: 0,
    createdAt: new Date().toISOString(),
    isVerified: false
  }

  // In real app, save to database
  sampleReviews.push(newReview)
  return newReview
}

export const updateReviewHelpfulness = (reviewId: string, helpful: boolean): void => {
  const review = sampleReviews.find(r => r.id === reviewId)
  if (review) {
    if (helpful) {
      review.helpful++
    } else {
      review.notHelpful++
    }
  }
}

export const getTopRatedPandals = (limit: number = 10): Array<{pandalId: number, rating: number, reviewCount: number}> => {
  const pandalIds = Array.from(new Set(sampleReviews.map(r => r.pandalId)))
  
  return pandalIds
    .map(pandalId => {
      const summary = getRatingSummary(pandalId)
      return {
        pandalId,
        rating: summary.averageRating,
        reviewCount: summary.totalReviews
      }
    })
    .filter(item => item.reviewCount >= 2) // Only include pandals with at least 2 reviews
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit)
}
