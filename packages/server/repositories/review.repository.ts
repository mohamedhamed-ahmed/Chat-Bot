import type { Review } from '../generated/prisma/client';
import { prisma } from '../lib/prisma';

export const reviewRepository = {
   getReviews: async (productId: number): Promise<Review[]> =>
      prisma.review.findMany({
         where: {
            productId,
         },
         orderBy: {
            createdAt: 'desc',
         },
      }),
};
