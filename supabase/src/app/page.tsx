'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isLogin, setIsLogin] = useState(false);
  const [records, setRecords] = useState<any[] | null>([]);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
  );

  // 'page' table의 모든 값을 조회
  const refreshHistory = async () => {
    const { data, error } = await supabase.from('page').select('*');

    setRecords(data);
  };

  // 'page' table에 대해서 'title'과 'body'의 값을 삽입받는다. 이후 글을 갱신한다.
  const recordHandler = async () => {
    const { data, error } = await supabase
      .from('page')
      .insert([{ title: prompt('title?'), body: prompt('body?') }]);

    refreshHistory();
  };

  // 'page' table에 대해서 id 값을 인자로 받아 해당 테이블의 데이터를 삭제한다. 이후 글을 갱신한다.
  const deleteRecord = async (id: number) => {
    const { data, error } = await supabase.from('page').delete().eq('id', id);

    refreshHistory();
  };

  const signInWithGithub = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: 'http://localhost:3000',
      },
    });
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    checkLogin();
  };

  const checkLogin = async () => {
    const authInfo = await supabase.auth.getSession();
    const session = authInfo.data.session;

    if (session) setIsLogin(true);
    else setIsLogin(false);
  };

  useEffect(() => {
    refreshHistory();
    checkLogin();
  }, []);

  return (
    <main className='flex min-h-screen flex-col gap-4 p-12'>
      {records &&
        records.map((value, index) => (
          <div key={index}>
            <h1 className='text-3xl leading-relaxed'>{value.title}</h1>
            <h3>{value.body}</h3>
            <input
              type='button'
              value='delete'
              onClick={() => deleteRecord(value.id)}
              className='cursor-pointer border-2 border-red-600 bg-red-600 text-white w-20 rounded-md hover:bg-black'
            />
          </div>
        ))}

      <input
        type='button'
        onClick={recordHandler}
        value='create'
        className='cursor-pointer border border-white w-24 hover:bg-white hover:text-black'
      />

      <input
        type='button'
        onClick={isLogin ? signOut : signInWithGithub}
        value={isLogin ? '로그아웃' : '로그인'}
        className='cursor-pointer border border-white bg-blue-400 w-32 mt-12 rounded-lg'
      />
    </main>
  );
}
