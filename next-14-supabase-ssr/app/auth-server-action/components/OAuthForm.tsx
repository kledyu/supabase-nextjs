'use client';

import { Button } from '@/components/ui/button';
import { createBrowserClient } from '@supabase/ssr';
import React from 'react';

export default function OAuthForm() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const signInWithGithub = () => {
    supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${location.origin}/auth-server-action/callback`,
      },
    });
  };

  return (
    <Button onClick={signInWithGithub} className='w-full'>
      Login With Github
    </Button>
  );
}
