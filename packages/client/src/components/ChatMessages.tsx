import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

export type Message = {
   role: 'user' | 'bot';
   content: string;
};

type Props = {
   messages: Message[];
};

function ChatMessages({ messages }: Props) {
   const lastMessageRef = useRef<HTMLDivElement | null>(null);

   useEffect(() => {
      if (lastMessageRef.current) {
         lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
      }
   }, [messages]);

   const onCopyHandler = (e: React.ClipboardEvent<HTMLParagraphElement>) => {
      const selectedText = window.getSelection()?.toString()?.trim();
      if (selectedText) {
         e.preventDefault();
         e.clipboardData.setData('text/plain', selectedText);
      }
   };

   return (
      <div className="flex flex-col gap-2">
         {messages.map((message, index) => (
            <div
               key={index}
               className={`px-3 py-2 max-w-md rounded-xl ${message.role === 'user' ? 'bg-blue-600 self-end text-white' : 'bg-gray-100 self-start text-black'}`}
               ref={index === messages.length - 1 ? lastMessageRef : null}
               onCopy={onCopyHandler}
            >
               <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
         ))}
      </div>
   );
}

export default ChatMessages;
