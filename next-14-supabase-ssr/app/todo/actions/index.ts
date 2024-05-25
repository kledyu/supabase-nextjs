'use server';

import createSupabaseServerClient from '@/lib/supabase/server';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';

export async function createTodo(title: string) {
  const supabase = await createSupabaseServerClient();
  const result = await supabase.from('page').insert({ title }).single();
  revalidatePath('/todo');

  return JSON.stringify(result);
}

export async function readTodo() {
  noStore();
  const supabase = await createSupabaseServerClient();

  return await supabase.from('page').select('*');
}

export async function deleteTodoById(id: string) {
  const supabase = await createSupabaseServerClient();

  await supabase.from('page').delete().eq('id', id);

  revalidatePath('/todo');
}

export async function updateTodoById(id: string, completed: boolean) {
  const supabase = await createSupabaseServerClient();

  await supabase.from('page').update({ completed }).eq('id', id);

  revalidatePath('/todo');
}
