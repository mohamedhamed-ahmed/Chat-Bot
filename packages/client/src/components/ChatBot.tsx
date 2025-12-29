import axios from 'axios';
import { useRef, useState } from 'react';
import TypingIndicator from './TypingIndicator';
import type { Message } from './ChatMessages';
import ChatMessages from './ChatMessages';
import ChatInput, { type ChatFormData } from './ChatInput';
import notification from '../assets/sounds/notification.mp3';
import pop from '../assets/sounds/pop.mp3';

type ResponseData = {
   message: string;
};

const notificationSound = new Audio(notification);
notificationSound.volume = 0.2;
const popSound = new Audio(pop);
popSound.volume = 0.2;

const ChatBot = () => {
   const conversationId = useRef(crypto.randomUUID());
   const [isTyping, setIsTyping] = useState(false);
   const [messages, setMessages] = useState<Message[]>([]);
   const [errors, setErrors] = useState('');

   const onSubmit = async ({ prompt }: ChatFormData) => {
      try {
         setIsTyping(true);
         setErrors('');
         popSound.play();
         setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
         const { data } = await axios.post<ResponseData>('/api/chat', {
            conversationId: conversationId.current,
            prompt,
         });

         setMessages((prev) => [
            ...prev,
            { content: data.message, role: 'bot' },
         ]);
         notificationSound.play();
      } catch {
         setErrors('Failed to generate response');
      } finally {
         setIsTyping(false);
      }
   };

   return (
      <div className="flex flex-col h-full">
         <div className="flex flex-col flex-1 gap-2 mb-5 overflow-y-auto">
            <ChatMessages messages={messages} />
            {isTyping && <TypingIndicator />}
            {errors && <p className="text-red-500">{errors}</p>}
         </div>
         <ChatInput onSubmit={onSubmit} />
      </div>
   );
};

export default ChatBot;
