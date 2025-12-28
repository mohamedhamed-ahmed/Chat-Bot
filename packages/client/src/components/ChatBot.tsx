import { useForm } from 'react-hook-form';
import { FaArrowUp } from 'react-icons/fa';
import { Button } from './ui/button';
type FormData = {
   prompt: string;
};

const ChatBot = () => {
   const { register, handleSubmit, reset, formState } = useForm<FormData>();

   const onSubmit = (data: FormData) => {
      console.log(data);
      reset();
   };
   const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(onSubmit)();
      }
   };

   return (
      <form
         className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
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
   );
};

export default ChatBot;
