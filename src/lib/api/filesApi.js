import { supabase } from '../supabaseClient';

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

