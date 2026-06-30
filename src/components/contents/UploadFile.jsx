import { Upload } from 'lucide-react';
import { useState } from 'react';
import { uploadContentFile } from '../../lib/crmApi';
import ErrorState from '../ui/ErrorState.jsx';

export default function UploadFile({ contentId, userId, onUpload }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const uploaded = await uploadContentFile({ contentId, file, userId });
      onUpload?.(uploaded);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-md border border-dashed border-line bg-slate-50 p-4">
      <label className="flex cursor-pointer flex-col items-center gap-2 text-center text-sm text-muted">
        <Upload className="h-5 w-5 text-brand-600" />
        <span>{uploading ? 'Caricamento file...' : 'Carica bozza grafica o file creativo'}</span>
        <input className="hidden" type="file" accept="image/*,application/pdf,video/*" disabled={uploading} onChange={(event) => handleFile(event.target.files?.[0])} />
      </label>
      <ErrorState message={error} />
    </div>
  );
}
