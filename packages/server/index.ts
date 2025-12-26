import express from 'express';
import dotenv from 'dotenv';
import type { Request, Response } from 'express';
import openai from 'openai';
import z from 'zod';
import { conversationRepository } from './repositories/conversation.repository';

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

dotenv.config();

const openaiClient = new openai({
   apiKey: process.env.OPENAI_API_KEY,
});

const conversationSchema = z.object({
   conversationId: z.uuid(),
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt is required')
      .max(1000, 'Prompt is too long (max 1000 characters)'),
});

app.get('/', (req: Request, res: Response) => {
   res.send(`Hello World!`);
});

app.post('/api/chat', async (req: Request, res: Response) => {
   const parsedResult = conversationSchema.safeParse(req.body);
   if (!parsedResult.success) {
      res.status(400).json(parsedResult.error.format());
      return;
   }

   try {
      const { prompt, conversationId } = req.body;

      const response = await openaiClient.responses.create({
         model: 'gpt-4o-mini',
         temperature: 0.2,
         max_output_tokens: 1000,
         input: prompt,
         previous_response_id:
            conversationRepository.getConversation(conversationId),
      });

      conversationRepository.setConversation(conversationId, response.id);

      res.json({ message: response.output_text });
   } catch (error) {
      res.status(500).json({ error: 'Failed to generate response' });
   }
});

app.get('/api/hello', (req: Request, res: Response) => {
   res.json({ message: 'Hello World!' });
});

app.listen(3000, () => {
   console.log(`Server is running on http://localhost:${port}`);
});
