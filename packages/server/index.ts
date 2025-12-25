import express from "express";
import dotenv from "dotenv";
import type { Request, Response } from "express";

const app = express();
const port = process.env.PORT || 3000;

dotenv.config();

app.get("/", (req: Request, res: Response) => {
  res.send(`${process.env.OPENAI_API_KEY}`);
});

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:${port}`);
});