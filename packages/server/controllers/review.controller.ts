import type { Request, Response } from 'express';
import { reviewService } from '../services/review.service';
import { productService } from '../services/product.service';

export const reviewController = {
   getReviews: async (req: Request, res: Response) => {
      const { id } = req.params;
      const productId = Number(id);

      if (isNaN(productId)) {
         res.status(400).json({ error: 'Invalid product ID' });
         return;
      }
      try {
         const product = await productService.getProduct(productId);
         if (!product) {
            res.status(404).json({ error: 'Product not found' });
            return;
         }

         const reviews = await reviewService.getReviews(productId);
         const summary = await reviewService.summarizeReviews(productId);
         res.json({ reviews, summary });
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
         const product = await productService.getProduct(productId);
         if (!product) {
            res.status(400).json({ error: 'Invalid product' });
            return;
         }

         const reviews = await reviewService.getReviews(productId, 1);
         if (reviews.length === 0) {
            res.status(400).json({ error: 'No reviews found' });
            return;
         }

         const summary = await reviewService.summarizeReviews(productId);
         res.json({ summary });
      } catch (error) {
         res.status(500).json({ error: 'Failed to fetch reviews' });
      }
   },
};
