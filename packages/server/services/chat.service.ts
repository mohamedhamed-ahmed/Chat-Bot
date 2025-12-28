import openai from 'openai';
import { conversationRepository } from '../repositories/conversation.repository';

const openaiClient = new openai({
   apiKey: process.env.OPENAI_API_KEY,
});

type ChatResponse = {
   id: string;
   message: string;
};

export const chatService = {
   sendMessage: async (
      conversationId: string,
      prompt: string
   ): Promise<ChatResponse> => {
      const response = await openaiClient.responses.create({
         model: 'gpt-4o-mini',
         temperature: 0.2,
         max_output_tokens: 200,
         input: prompt,
         previous_response_id:
            conversationRepository.getConversation(conversationId),
      });

      conversationRepository.setConversation(conversationId, response.id);

      return {
         id: response.id,
         message: response.output_text,
      };
   },
};
