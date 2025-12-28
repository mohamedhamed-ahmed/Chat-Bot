import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { FaArrowUp } from 'react-icons/fa';

export type ChatFormData = {
   prompt: string;
};

type Props = {
   onSubmit: (data: ChatFormData) => void;
};

function ChatInput({ onSubmit }: Props) {
   const { register, handleSubmit, formState, reset } = useForm<ChatFormData>();

   const submitHandler = handleSubmit((data: ChatFormData) => {
      reset({ prompt: '' });
      onSubmit(data);
   });

   const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         submitHandler();
      }
   };

   return (
      <form
         className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
         autoFocus
         onSubmit={submitHandler}
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
   );
}

export default ChatInput;
