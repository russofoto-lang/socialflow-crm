import { supabase } from '../supabaseClient';
import { addComment } from './commentsApi';

export async function approveContent({ id, userId }) {
  const { data, error } = await supabase
    .from('contents')
    .update({ approval_status: 'approved', approved_at: new Date().toISOString(), approved_by: userId })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function requestChanges({ id, userId, commentText }) {
  const { data, error } = await supabase
    .from('contents')
    .update({ approval_status: 'changes_requested', status: 'in_progress', approved_at: null, approved_by: null })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  await addComment({ content_id: id, user_id: userId, comment_text: commentText, comment_type: 'client' });
  return data;
}

