import { supabase } from './supabaseClient';

const contentSelect = `
  *,
  clients:client_id(id,name,status),
  content_files(*),
  comments(*, profiles:user_id(full_name,role))
`;

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, clients:client_id(*)')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

export async function listClients() {
  const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function upsertClient(payload) {
  const { data, error } = await supabase.from('clients').upsert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function deleteClient(id) {
  const { error } = await supabase.from('clients').delete().eq('id', id);
  if (error) throw error;
}

export async function listContents(filters = {}) {
  let query = supabase.from('contents').select(contentSelect).order('scheduled_date', { ascending: true });
  if (filters.client_id) query = query.eq('client_id', filters.client_id);
  if (filters.status) query = query.eq('status', filters.status);
  if (filters.content_type) query = query.eq('content_type', filters.content_type);
  if (filters.platform) query = query.eq('platform', filters.platform);
  if (filters.scheduled_date) query = query.eq('scheduled_date', filters.scheduled_date);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getContent(id) {
  const { data, error } = await supabase.from('contents').select(contentSelect).eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function upsertContent(payload) {
  const allowed = [
    'id',
    'client_id',
    'title',
    'content_type',
    'platform',
    'copy_text',
    'internal_notes',
    'scheduled_date',
    'status',
    'approval_status',
    'approved_at',
    'approved_by',
    'created_by'
  ];
  const cleanPayload = Object.fromEntries(Object.entries(payload).filter(([key]) => allowed.includes(key)));
  const { data, error } = await supabase.from('contents').upsert(cleanPayload).select().single();
  if (error) throw error;
  return data;
}

export async function updateContentStatus(id, status) {
  const { data, error } = await supabase
    .from('contents')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function duplicateContent(content, createdBy) {
  return upsertContent({
    client_id: content.client_id,
    title: `Copia di ${content.title}`,
    content_type: content.content_type,
    platform: content.platform,
    copy_text: content.copy_text,
    internal_notes: content.internal_notes,
    scheduled_date: content.scheduled_date,
    status: 'ideas',
    approval_status: 'not_required',
    created_by: createdBy
  });
}

export async function deleteContent(id) {
  const { error } = await supabase.from('contents').delete().eq('id', id);
  if (error) throw error;
}

export async function addComment({ content_id, user_id, comment_text, comment_type }) {
  const { data, error } = await supabase
    .from('comments')
    .insert({ content_id, user_id, comment_text, comment_type })
    .select('*, profiles:user_id(full_name,role)')
    .single();
  if (error) throw error;
  return data;
}

export async function uploadContentFile({ contentId, file, userId }) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
  const path = `${contentId}/${Date.now()}-${safeName}`;
  const { error: uploadError } = await supabase.storage.from('content-files').upload(path, file);
  if (uploadError) throw uploadError;
  const { data, error } = await supabase
    .from('content_files')
    .insert({
      content_id: contentId,
      file_name: file.name,
      file_path: path,
      file_type: file.type,
      uploaded_by: userId
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export function getFilePublicUrl(path) {
  return supabase.storage.from('content-files').getPublicUrl(path).data.publicUrl;
}

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
