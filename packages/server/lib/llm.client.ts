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

const openaiClient = new openai({
   apiKey: process.env.OPENAI_API_KEY,
});

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
};
