import { conversationRepository } from '../repositories/conversation.repository';
import chatbotPrompt from '../prompts/chatbot.txt';
import fs from 'fs';
import path from 'path';
import { llmClient } from '../lib/llm.client';

const parkInfo = fs.readFileSync(
   path.join(__dirname, '../prompts/WonderWorld.md'),
   'utf8'
);
const instructions = chatbotPrompt.replace('{{parkInfo}}', parkInfo);

type ChatResponse = {
   id: string;
   message: string;
};

export const chatService = {
   sendMessage: async (
      conversationId: string,
      prompt: string
   ): Promise<ChatResponse> => {
      const { id, text } = await llmClient.generateText({
         model: 'gpt-4o-mini',
         instructions,
         temperature: 0.2,
         maxTokens: 200,
         input: prompt,
         previousResponseId:
            conversationRepository.getConversation(conversationId),
      });

      conversationRepository.setConversation(conversationId, id);

      return {
         id,
         message: text,
      };
   },
};
