import type { Review } from '../generated/prisma/client';
import { llmClient } from '../lib/llm.client';
import { reviewRepository } from '../repositories/review.repository';
import summarizeReviewsPrompt from '../prompts/summarize-reviews.txt';

export const reviewService = {
   getReviews: async (productId: number): Promise<Review[]> =>
      reviewRepository.getReviews(productId),
   summarizeReviews: async (productId: number): Promise<string> => {
      const existingSummary =
         await reviewRepository.getReviewSummary(productId);
      if (existingSummary && existingSummary.expiresAt > new Date()) {
         return existingSummary.content;
      }

      const reviews = await reviewRepository.getReviews(productId, 10);
      const joinedReviews = reviews
         .map((review) => review.content)
         .join('\n\n');

      const prompt = summarizeReviewsPrompt.replace(
         '{{joinedReviews}}',
         joinedReviews
      );

      const { text } = await llmClient.generateText({
         model: 'gpt-4.1',
         input: prompt,
         temperature: 0.2,
         maxTokens: 500,
      });

      await reviewRepository.storeReviewSummary(productId, text);

      return text;
   },
};
