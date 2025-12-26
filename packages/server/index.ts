import express from 'express';
import dotenv from 'dotenv';
import type { Request, Response } from 'express';
import { chatController } from './controllers/chat.controller';

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

dotenv.config();

app.get('/', (req: Request, res: Response) => {
   res.send(`Hello World!`);
});

app.post('/api/chat', chatController.sendMessage);

app.get('/api/hello', (req: Request, res: Response) => {
   res.json({ message: 'Hello World!' });
});

app.listen(3000, () => {
   console.log(`Server is running on http://localhost:${port}`);
});
