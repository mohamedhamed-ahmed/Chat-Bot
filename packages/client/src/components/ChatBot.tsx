import axios from 'axios';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaArrowUp } from 'react-icons/fa';
import { Button } from './ui/button';
import TypingIndicator from './TypingIndicator';
import type { Message } from './ChatMessages';
import ChatMessages from './ChatMessages';
type FormData = {
   prompt: string;
};

type ResponseData = {
   message: string;
};

const ChatBot = () => {
   const conversationId = useRef(crypto.randomUUID());
   const [isTyping, setIsTyping] = useState(false);
   const [messages, setMessages] = useState<Message[]>([]);
   const [errors, setErrors] = useState('');
   const { register, handleSubmit, reset, formState } = useForm<FormData>();

   const onSubmit = async ({ prompt }: FormData) => {
      try {
         setIsTyping(true);
         setErrors('');
         setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
         reset({ prompt: '' });
         const { data } = await axios.post<ResponseData>('/api/chat', {
            conversationId: conversationId.current,
            prompt,
         });

         setMessages((prev) => [
            ...prev,
            { content: data.message, role: 'bot' },
         ]);
      } catch {
         setErrors('Failed to generate response');
      } finally {
         setIsTyping(false);
      }
   };
   const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(onSubmit)();
      }
   };

   return (
      <div className="flex flex-col h-full">
         <div className="flex flex-col flex-1 gap-2 mb-5 overflow-y-auto">
            <ChatMessages messages={messages} />
            {isTyping && <TypingIndicator />}
            {errors && <p className="text-red-500">{errors}</p>}
         </div>
         <form
            className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
            autoFocus
            // eslint-disable-next-line react-hooks/refs
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={handleKeyDown}
         >
            <textarea
               {...register('prompt', {
                  required: true,
                  validate: (value: string) => value.trim().length > 0,
               })}
               className="w-full p-2 border-0 focus:outline-none resize-none"
               placeholder="Ask anything"
               maxLength={1000}
            />
            <Button
               className="rounded-full w-9 h-9"
               type="submit"
               disabled={!formState.isValid}
            >
               <FaArrowUp />
            </Button>
         </form>
      </div>
   );
};

export default ChatBot;
