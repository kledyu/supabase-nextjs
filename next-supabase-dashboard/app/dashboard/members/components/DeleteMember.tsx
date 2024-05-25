'use client';

import { Button } from '@/components/ui/button';
import { TrashIcon } from '@radix-ui/react-icons';
import { deleteMemberById } from '../actions';
import { useTransition } from 'react';
import { toast } from '@/components/ui/use-toast';

interface IDeleteMember {
  user_id: string;
}

export default function DeleteMember({ user_id }: IDeleteMember) {
  const [isPending, startTransition] = useTransition();

  const onSubmit = () => {
    startTransition(async () => {
      const result = JSON.parse(await deleteMemberById(user_id));

      if (result?.error.message) {
        toast({
          title: '삭제 실패',
        });
      } else {
        toast({
          title: '삭제 성공',
        });
      }
    });
  };

  return (
    <form action={onSubmit}>
      <Button variant='outline'>
        <TrashIcon />
        Delete
      </Button>
    </form>
  );
}
