import dayjs from 'dayjs';
import type { Review } from '../generated/prisma/client';
import { prisma } from '../lib/prisma';

export const reviewRepository = {
   getReviews: async (productId: number, limit?: number): Promise<Review[]> =>
      prisma.review.findMany({
         where: {
            productId,
         },
         orderBy: {
            createdAt: 'desc',
         },
         take: limit,
      }),
   storeReviewSummary: async (productId: number, summary: string) => {
      const now = new Date();
      const expiresAt = dayjs().add(7, 'day').toDate();

      const data = {
         content: summary,
         productId,
         expiresAt,
         createdAt: now,
      };

      return prisma.summary.upsert({
         where: {
            productId,
         },
         update: data,
         create: data,
      });
   },
};
