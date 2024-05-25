'use server';
import { createSupbaseServerClientReadOnly } from '../supabase';

// 유저의 세션 조회 (보통 page protection에 사용)
export async function readUserSession() {
  const supabase = await createSupbaseServerClientReadOnly();

  return supabase.auth.getSession();
}
