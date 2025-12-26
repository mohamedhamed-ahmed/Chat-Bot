const conversations = new Map<string, string>();

export const conversationRepository = {
   getConversation: (conversationId: string) => {
      return conversations.get(conversationId);
   },

   setConversation: (conversationId: string, responseId: string) => {
      conversations.set(conversationId, responseId);
   },
};
