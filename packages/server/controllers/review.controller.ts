import type { Request, Response } from 'express';
import { reviewService } from '../services/review.service';

export const reviewController = {
   getReviews: async (req: Request, res: Response) => {
      const { id } = req.params;
      const productId = Number(id);

      if (isNaN(productId)) {
         res.status(400).json({ error: 'Invalid product ID' });
         return;
      }
      try {
         const reviews = await reviewService.getReviews(productId);
         res.json(reviews);
      } catch (error) {
         res.status(500).json({ error: 'Failed to fetch reviews' });
      }
   },
   summarizeReviews: async (req: Request, res: Response) => {
      const { id } = req.params;
      const productId = Number(id);

      if (isNaN(productId)) {
         res.status(400).json({ error: 'Invalid product ID' });
         return;
      }

      try {
         const summary = await reviewService.summarizeReviews(productId);
         res.json({ summary });
      } catch (error) {
         res.status(500).json({ error: 'Failed to fetch reviews' });
      }
   },
};
