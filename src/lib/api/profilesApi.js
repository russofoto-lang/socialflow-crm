import { supabase } from '../supabaseClient';

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, clients:client_id(*)')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

