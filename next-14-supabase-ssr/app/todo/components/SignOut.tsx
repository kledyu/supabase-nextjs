import { Button } from '@/components/ui/button';
import createSupabaseServerClient from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default function SignOut() {
  const logOut = async () => {
    'use server';

    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
    redirect('/auth-server-action');
  };
  return (
    <form action={logOut}>
      <Button>SignOut</Button>
    </form>
  );
}
