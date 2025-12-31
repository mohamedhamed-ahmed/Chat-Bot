import type { Review } from '../generated/prisma/client';
import { reviewRepository } from '../repositories/review.repository';

export const reviewService = {
   getReviews: async (productId: number): Promise<Review[]> =>
      reviewRepository.getReviews(productId),
};
