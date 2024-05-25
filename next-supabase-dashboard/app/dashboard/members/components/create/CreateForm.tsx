'use client';

import * as F from '@/components/ui/form';
import * as S from '@/components/ui/select';
import * as z from 'zod';

import { Input } from '@/components/ui/input';
import { useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { createMember } from '../../actions';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { cn } from '@/lib/utils';

const FormSchema = z
  .object({
    name: z.string().min(2, {
      message: 'Username must be at least 2 characters.',
    }),
    role: z.enum(['user', 'admin']),
    status: z.enum(['active', 'resigned']),
    email: z.string().email(),
    password: z.string().min(6, { message: 'Password should be 6 characters' }),
    confirm: z.string().min(6, { message: 'Password should be 6 characters' }),
  })
  .refine((data) => data.confirm === data.password, {
    message: "Passowrd doesn't match",
    path: ['confirm'],
  });

export default function MemberForm() {
  const [isPending, startTransition] = useTransition();
  const roles = ['admin', 'user'];
  const status = ['active', 'resigned'];

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      role: 'user',
      status: 'active',
      email: '',
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(async () => {
      const result = await createMember(data);
      const { error } = JSON.parse(result);

      if (error?.message) {
        console.log(error);
        toast({
          title: '멤버 생성 실패',
          description: (
            <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
              <code className='text-white'>
                {JSON.stringify(data, null, 2)}
              </code>
            </pre>
          ),
        });
      } else {
        document.getElementById('create-trigger')?.click();

        toast({
          title: '멤버 생성 성공',
          description: (
            <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
              <code className='text-white'>
                {JSON.stringify(data, null, 2)}
              </code>
            </pre>
          ),
        });
      }
    });
  }

  return (
    <F.Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-6'>
        <F.FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <F.FormItem>
              <F.FormLabel>Email</F.FormLabel>
              <F.FormControl>
                <Input
                  placeholder='email@gmail.com'
                  type='email'
                  {...field}
                  onChange={field.onChange}
                />
              </F.FormControl>
              <F.FormMessage />
            </F.FormItem>
          )}
        />
        <F.FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <F.FormItem>
              <F.FormLabel>Password</F.FormLabel>
              <F.FormControl>
                <Input
                  placeholder='******'
                  type='password'
                  onChange={field.onChange}
                />
              </F.FormControl>
              <F.FormMessage />
            </F.FormItem>
          )}
        />
        <F.FormField
          control={form.control}
          name='confirm'
          render={({ field }) => (
            <F.FormItem>
              <F.FormLabel>Confirm Password</F.FormLabel>
              <F.FormControl>
                <Input
                  placeholder='******'
                  type='password'
                  onChange={field.onChange}
                />
              </F.FormControl>
              <F.FormMessage />
            </F.FormItem>
          )}
        />
        <F.FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <F.FormItem>
              <F.FormLabel>Username</F.FormLabel>
              <F.FormControl>
                <Input placeholder='display name' onChange={field.onChange} />
              </F.FormControl>
              <F.FormDescription>
                This is your public display name.
              </F.FormDescription>
              <F.FormMessage />
            </F.FormItem>
          )}
        />
        <F.FormField
          control={form.control}
          name='role'
          render={({ field }) => (
            <F.FormItem>
              <F.FormLabel>Role</F.FormLabel>
              <S.Select
                onValueChange={field.onChange}
                defaultValue={field.value}>
                <F.FormControl>
                  <S.SelectTrigger>
                    <S.SelectValue placeholder='Select a role' />
                  </S.SelectTrigger>
                </F.FormControl>
                <S.SelectContent>
                  {roles.map((role, index) => {
                    return (
                      <S.SelectItem value={role} key={index}>
                        {role}
                      </S.SelectItem>
                    );
                  })}
                </S.SelectContent>
              </S.Select>

              <F.FormMessage />
            </F.FormItem>
          )}
        />
        <F.FormField
          control={form.control}
          name='status'
          render={({ field }) => (
            <F.FormItem>
              <F.FormLabel>Status</F.FormLabel>
              <S.Select
                onValueChange={field.onChange}
                defaultValue={field.value}>
                <F.FormControl>
                  <S.SelectTrigger>
                    <S.SelectValue placeholder='Select user status' />
                  </S.SelectTrigger>
                </F.FormControl>
                <S.SelectContent>
                  {status.map((status, index) => {
                    return (
                      <S.SelectItem value={status} key={index}>
                        {status}
                      </S.SelectItem>
                    );
                  })}
                </S.SelectContent>
              </S.Select>
              <F.FormDescription>
                status resign mean the user is no longer work here.
              </F.FormDescription>

              <F.FormMessage />
            </F.FormItem>
          )}
        />
        <Button
          type='submit'
          className='flex items-center w-full gap-2'
          variant='outline'>
          Submit{' '}
          <AiOutlineLoading3Quarters
            className={cn('animate-spin', { hidden: !isPending })}
          />
        </Button>
      </form>
    </F.Form>
  );
}
