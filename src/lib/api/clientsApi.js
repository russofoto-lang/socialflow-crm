import { supabase } from '../supabaseClient';

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

export async function updateClientStatus(id, status) {
  const { data, error } = await supabase
    .from('clients')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

