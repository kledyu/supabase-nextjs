import React from 'react';
import AuthForm from './components/AuthForm';
import { readUserSession } from '@/lib/actions';
import { redirect } from 'next/navigation';

export default async function page() {
  const { data: userSession } = await readUserSession();

  // page protection
  if (userSession.session) redirect('/dashboard');

  return (
    <div className='flex items-center justify-center h-screen'>
      <AuthForm />
    </div>
  );
}
