import { useEffect, useState } from 'react';
import { Upload } from 'lucide-react';
import { contentTypeOptions, platformOptions, statusOptions } from '../../lib/options';
import ErrorState from '../ui/ErrorState.jsx';
import UploadFile from './UploadFile.jsx';

const emptyContent = {
  title: '',
  client_id: '',
  content_type: 'post',
  platform: 'instagram',
  copy_text: '',
  internal_notes: '',
  scheduled_date: '',
  status: 'ideas',
  approval_status: 'not_required'
};

export default function ContentForm({ initialValue, clients, onSubmit, onCancel, saving, onUpload, userId }) {
  const [form, setForm] = useState(emptyContent);
  const [pendingFile, setPendingFile] = useState(null);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    setForm({ ...emptyContent, ...(initialValue ?? {}) });
    setPendingFile(null);
    setValidationError('');
  }, [initialValue]);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const submit = (event) => {
    event.preventDefault();
    if (!form.title.trim()) {
      setValidationError('Il titolo e obbligatorio.');
      return;
    }
    if (!form.client_id) {
      setValidationError('Seleziona un cliente.');
      return;
    }
    if (!form.content_type) {
      setValidationError('Seleziona un tipo contenuto.');
      return;
    }
    if (!form.platform) {
      setValidationError('Seleziona una piattaforma.');
      return;
    }
    setValidationError('');
    onSubmit({
      ...form,
      title: form.title.trim(),
      pendingFile,
      scheduled_date: form.scheduled_date || null,
      approval_status: form.status === 'to_approve' ? 'pending' : form.approval_status
    });
  };

  return (
    <form className="surface grid gap-5 p-5" onSubmit={submit}>
      <div>
        <h2 className="section-title">{initialValue?.id ? 'Modifica contenuto' : 'Nuovo contenuto'}</h2>
        <p className="mt-1 text-sm text-muted">Compila i dati editoriali e collega il contenuto al cliente corretto.</p>
      </div>
      <ErrorState message={validationError} />
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold md:col-span-2">Titolo<input className="form-input mt-1" required value={form.title} onChange={(e) => update('title', e.target.value)} /></label>
        <label className="text-sm font-semibold">Cliente<select className="form-input mt-1" required value={form.client_id} onChange={(e) => update('client_id', e.target.value)}><option value="">Seleziona cliente</option>{clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}</select></label>
        <label className="text-sm font-semibold">Tipo<select className="form-input mt-1" required value={form.content_type} onChange={(e) => update('content_type', e.target.value)}>{contentTypeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
        <label className="text-sm font-semibold">Piattaforma<select className="form-input mt-1" required value={form.platform} onChange={(e) => update('platform', e.target.value)}>{platformOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
        <label className="text-sm font-semibold">Data prevista<input className="form-input mt-1" type="date" value={form.scheduled_date ?? ''} onChange={(e) => update('scheduled_date', e.target.value)} /></label>
        <label className="text-sm font-semibold">Stato<select className="form-input mt-1" value={form.status} onChange={(e) => update('status', e.target.value)}>{statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
        <label className="text-sm font-semibold md:col-span-2">Copy/testo<textarea className="form-input mt-1 min-h-32" value={form.copy_text ?? ''} onChange={(e) => update('copy_text', e.target.value)} /></label>
        <label className="text-sm font-semibold md:col-span-2">Note interne<textarea className="form-input mt-1 min-h-24" value={form.internal_notes ?? ''} onChange={(e) => update('internal_notes', e.target.value)} /></label>
      </div>
      {initialValue?.id ? (
        <UploadFile contentId={initialValue.id} userId={userId} onUpload={onUpload} />
      ) : (
        <div className="rounded-md border border-dashed border-line bg-slate-50 p-4">
          <label className="flex cursor-pointer flex-col items-center gap-2 text-center text-sm text-muted">
            <Upload className="h-5 w-5 text-brand-600" />
            <span>{pendingFile ? pendingFile.name : 'Aggiungi immagine o file creativo'}</span>
            <input
              className="hidden"
              type="file"
              accept="image/*,application/pdf,video/*"
              onChange={(event) => setPendingFile(event.target.files?.[0] ?? null)}
            />
          </label>
        </div>
      )}
      <div className="flex flex-wrap gap-3 border-t border-line pt-4">
        <button className="btn-primary" disabled={saving}>{saving ? 'Salvataggio...' : 'Salva contenuto'}</button>
        <button type="button" className="btn-secondary" onClick={onCancel}>Annulla</button>
      </div>
    </form>
  );
}
