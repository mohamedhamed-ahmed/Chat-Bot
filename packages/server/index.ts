import express from 'express';
import dotenv from 'dotenv';
import type { Request, Response } from 'express';
import z from 'zod';
import { chatService } from './services/chat.service';

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

dotenv.config();

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

      const response = await chatService.sendMessage(conversationId, prompt);
      res.json({ message: response.message });
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
