import { createClient } from '@/lib/supabase/server';
export async function getCurrentUser() {
  const sb = createClient();
  const { data } = await sb.auth.getUser();
  return data.user;
}
export async function isAdmin() {
  const sb = createClient();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return false;
  const { data } = await sb.from('admins').select('user_id').eq('user_id', user.id).maybeSingle();
  return !!data;
}
