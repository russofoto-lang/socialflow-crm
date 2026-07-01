import { supabase } from '../supabaseClient';

export async function addComment({ content_id, user_id, comment_text, comment_type }) {
  const { data, error } = await supabase
    .from('comments')
    .insert({ content_id, user_id, comment_text, comment_type })
    .select('*, profiles:user_id(full_name,role)')
    .single();
  if (error) throw error;
  return data;
}

