export interface Review {
  id: string
  pandalId: number
  userId: string
  userName: string
  rating: number // 1-5
  title: string
  comment: string
  photos?: string[]
  helpful: number
  notHelpful: number
  createdAt: string
  isVerified: boolean
}

export interface RatingSummary {
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

export interface UserReview {
  rating: number
  title: string
  comment: string
}
