import type { Review } from '../generated/prisma/client';
import { llmClient } from '../lib/llm.client';
import { reviewRepository } from '../repositories/review.repository';

export const reviewService = {
   getReviews: async (productId: number): Promise<Review[]> =>
      reviewRepository.getReviews(productId),
   summarizeReviews: async (productId: number): Promise<string> => {
      const reviews = await reviewRepository.getReviews(productId, 10);
      const joinedReviews = reviews
         .map((review) => review.content)
         .join('\n\n');

      const prompt = `Summarize the following product reviews highlighting the positive and negative aspects:

      ${joinedReviews}
      `;

      const { text } = await llmClient.generateText({
         model: 'gpt-4.1',
         input: prompt,
         temperature: 0.2,
         maxTokens: 500,
      });

      return text;
   },
};
