import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaArrowUp } from 'react-icons/fa';
import { Button } from './ui/button';
import TypingIndicator from './TypingIndicator';
type FormData = {
   prompt: string;
};

type ResponseData = {
   message: string;
};

type Message = {
   role: 'user' | 'bot';
   content: string;
};

const ChatBot = () => {
   const conversationId = useRef(crypto.randomUUID());
   const [isTyping, setIsTyping] = useState(false);
   const [messages, setMessages] = useState<Message[]>([]);
   const formRef = useRef<HTMLFormElement | null>(null);
   const { register, handleSubmit, reset, formState } = useForm<FormData>();

   useEffect(() => {
      if (formRef.current) {
         formRef.current.scrollIntoView({ behavior: 'smooth' });
      }
   }, [messages]);

   const onSubmit = async ({ prompt }: FormData) => {
      setIsTyping(true);
      setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
      reset();
      const { data } = await axios.post<ResponseData>('/api/chat', {
         conversationId: conversationId.current,
         prompt,
      });

      setMessages((prev) => [...prev, { content: data.message, role: 'bot' }]);
      setIsTyping(false);
   };
   const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(onSubmit)();
      }
   };

   return (
      <div>
         <div className="flex flex-col gap-2 mb-5">
            {messages.map((message, index) => (
               <div
                  key={index}
                  className={`px-3 py-2 rounded-xl ${message.role === 'user' ? 'bg-blue-600 self-end text-white' : 'bg-gray-100 self-start text-black'}`}
               >
                  <ReactMarkdown>{message.content}</ReactMarkdown>
               </div>
            ))}
            {isTyping && <TypingIndicator />}
         </div>
         <form
            ref={formRef}
            className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
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
