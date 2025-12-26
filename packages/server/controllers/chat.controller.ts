import type { Request, Response } from 'express';
import { chatService } from '../services/chat.service';
import z from 'zod';

const conversationSchema = z.object({
   conversationId: z.uuid(),
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt is required')
      .max(1000, 'Prompt is too long (max 1000 characters)'),
});

export const chatController = {
   sendMessage: async (req: Request, res: Response) => {
      const parsedResult = conversationSchema.safeParse(req.body);
      if (!parsedResult.success) {
         res.status(400).json(parsedResult.error.format());
         return;
      }
      try {
         const { prompt, conversationId } = req.body;

         const response = await chatService.sendMessage(conversationId, prompt);
         res.json({ message: response.message });
      } catch (error) {
         res.status(500).json({ error: 'Failed to generate response' });
      }
   },
};
