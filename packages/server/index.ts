import express from 'express';
import dotenv from 'dotenv';
import router from './routes';

const app = express();
app.use(express.json());
app.use(router);

const port = process.env.PORT || 3000;

dotenv.config();

app.listen(3000, () => {
   console.log(`Server is running on http://localhost:${port}`);
});
