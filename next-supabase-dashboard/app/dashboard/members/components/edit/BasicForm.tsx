'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { cn } from '@/lib/utils';
import { IPermission } from '@/lib/types';
import { updateMemberBasicById } from '../../actions';
import { useTransition } from 'react';

const FormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
});

export default function BasicForm({ permission }: { permission: IPermission }) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(async () => {
      const { data: result, error } = JSON.parse(
        await updateMemberBasicById({
          id: permission.member_id,
          data,
        })
      );

      if (error?.message) {
        toast({
          title: '유저 정보 업데이트 실패',
          description: (
            <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
              <code className='text-white'>{error?.message}</code>
            </pre>
          ),
        });
      } else {
        toast({
          title: '유저 정보 업데이트 완료',
        });
        console.log(result);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-6'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
              <FormControl>
                <Input placeholder='shadcn' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type='submit'
          className='flex items-center w-full gap-2'
          variant='outline'>
          Update{' '}
          <AiOutlineLoading3Quarters
            className={cn(' animate-spin', 'hidden')}
          />
        </Button>
      </form>
    </Form>
  );
}
