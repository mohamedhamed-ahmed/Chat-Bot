import { Ollama } from 'ollama';
import openai from 'openai';

type GenerateTextOptions = {
   model?: string;
   input: string;
   temperature?: number;
   maxTokens?: number;
   instructions?: string;
   previousResponseId?: string;
};

type GenerateTextResponse = {
   id: string;
   text: string;
};

type OllamaSummarizeTextOptions = {
   input: string;
   instructions: string;
};

const openaiClient = new openai({
   apiKey: process.env.OPENAI_API_KEY,
});

const ollamaClient = new Ollama();

export const llmClient = {
   generateText: async ({
      model = 'gpt-4.1',
      input,
      temperature = 0.2,
      maxTokens = 300,
      instructions,
      previousResponseId,
   }: GenerateTextOptions): Promise<GenerateTextResponse> => {
      const response = await openaiClient.responses.create({
         model,
         input,
         temperature,
         max_output_tokens: maxTokens,
         instructions,
         previous_response_id: previousResponseId,
      });

      return {
         id: response.id,
         text: response.output_text,
      };
   },
   summarizeText: async ({
      input,
      instructions,
   }: OllamaSummarizeTextOptions): Promise<string> => {
      const response = await ollamaClient.chat({
         model: 'llama3.1',
         messages: [
            {
               role: 'system',
               content: instructions,
            },
            {
               role: 'user',
               content: input,
            },
         ],
      });

      return response.message.content || '';
   },
};
