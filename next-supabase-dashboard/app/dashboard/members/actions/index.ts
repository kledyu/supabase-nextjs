'use server';

import { readUserSession } from '@/lib/actions';
import { createSupabaseAdmin, createSupbaseServerClient } from '@/lib/supabase';
import { revalidatePath, unstable_noStore } from 'next/cache';

interface ICreateMember {
  name: string;
  role: 'user' | 'admin';
  status: 'active' | 'resigned';
  email: string;
  password: string;
  confirm: string;
}

interface IUpdateMemberBasicById {
  id: string;
  data: { name: string };
}

export async function createMember(data: ICreateMember) {
  // 유저 세션
  const { data: userSession } = await readUserSession();

  // 유저 세션이 관리자가 아닌 경우 에러 반환
  if (userSession.session?.user.user_metadata.role !== 'admin') {
    return JSON.stringify({ error: { message: '허가되지 않은 요청입니다.' } });
  }

  const supabase = await createSupabaseAdmin();

  // create member
  const createResult = await supabase.auth.admin.createUser({
    email: data.email,
    password: data.password,
    email_confirm: true,
    user_metadata: { role: data.role },
  });

  if (createResult.error?.message) return JSON.stringify(createResult);
  else {
    const memberResult = await supabase.from('member').insert({
      name: data.name,
      id: createResult.data.user?.id,
      email: data.email,
    });

    if (memberResult.error?.message) return JSON.stringify(createResult);
    else {
      const permissionResult = await supabase.from('permission').insert({
        role: data.role,
        member_id: createResult.data.user?.id,
        status: data.status,
      });

      revalidatePath('/dashboard/members');

      return JSON.stringify(permissionResult);
    }
  }
}

// Update Member
export async function updateMemberBasicById({
  id,
  data,
}: IUpdateMemberBasicById) {
  const supabase = await createSupbaseServerClient();
  const result = supabase.from('member').update(data).eq('id', id);

  revalidatePath('/dashboard/members');

  return JSON.stringify(result);
}

export async function updateMemberAdvanceById(
  permission_id: string,
  user_id: string,
  data: { role: 'admin' | 'user'; status: 'active' | 'resigned' }
) {
  // 유저 세션
  const { data: userSession } = await readUserSession();

  // 유저 세션이 관리자가 아닌 경우 에러 반환
  if (userSession.session?.user.user_metadata.role !== 'admin') {
    return JSON.stringify({ error: { message: '허가되지 않은 요청입니다.' } });
  }

  const supabaseAdmin = await createSupabaseAdmin();
  const updateResult = await supabaseAdmin.auth.admin.updateUserById(user_id, {
    user_metadata: { role: data.role },
  });

  if (updateResult.error?.message) return JSON.stringify(updateResult);
  else {
    const supabase = await createSupbaseServerClient();
    const result = supabase
      .from('permission')
      .update(data)
      .eq('id', permission_id);

    revalidatePath('/dashboard/members');

    return JSON.stringify(result);
  }
}

// Delete Admin Only
export async function deleteMemberById(user_id: string) {
  const { data: userSession } = await readUserSession();

  // 1. Check is Admin
  if (userSession.session?.user.user_metadata.role !== 'admin') {
    return JSON.stringify({ error: { message: '허가되지 않은 요청입니다.' } });
  }

  // 2. Delete account
  const supabaseAdmin = await createSupabaseAdmin();
  const deleteResult = await supabaseAdmin.auth.admin.deleteUser(user_id);

  if (deleteResult.error?.message) return JSON.stringify(deleteResult);
  else {
    const supabase = await createSupbaseServerClient();
    const result = await supabase.from('member').delete().eq('id', user_id);

    revalidatePath('/dashboard/members');

    return JSON.stringify(result);
  }
}

export async function readMembers() {
  unstable_noStore();
  const supabase = await createSupbaseServerClient();

  return await supabase.from('permission').select('*, member(*)');
}
