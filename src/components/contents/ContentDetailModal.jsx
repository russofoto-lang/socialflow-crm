import { CalendarClock, Copy, Edit3, Save, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { statusOptions } from '../../lib/options';
import { formatDate, formatDateTime } from '../../utils/date';
import Badge from '../ui/Badge.jsx';
import ErrorState from '../ui/ErrorState.jsx';
import SuccessState from '../ui/SuccessState.jsx';
import ContentForm from './ContentForm.jsx';
import ContentPreview from './ContentPreview.jsx';

export default function ContentDetailModal({
  content,
  clients,
  saving,
  userId,
  onClose,
  onSubmit,
  onUpload,
  onDuplicate,
  onStatusChange,
  onDelete
}) {
  const [mode, setMode] = useState('view');
  const [busyAction, setBusyAction] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setMode('view');
    setBusyAction('');
    setError('');
    setSuccess('');
  }, [content?.id]);

  if (!content) return null;

  const runAction = async (name, action, successMessage) => {
    setBusyAction(name);
    setError('');
    setSuccess('');
    try {
      await action();
      setSuccess(successMessage);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyAction('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/40 p-3 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true">
      <div className="ml-auto flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-soft">
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-wide text-brand-700">Scheda contenuto</p>
            <h2 className="mt-1 truncate text-xl font-black">{content.title}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge value={content.status} />
              <Badge type="platform" value={content.platform} />
              <Badge type="contentType" value={content.content_type} />
              <Badge type="approval" value={content.approval_status} />
            </div>
          </div>
          <button className="btn-secondary px-3" onClick={onClose} aria-label="Chiudi scheda contenuto">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="grid flex-1 gap-0 overflow-y-auto lg:grid-cols-[20rem_1fr]">
          <aside className="border-b border-line bg-slate-50 p-5 lg:border-b-0 lg:border-r">
            <ContentPreview content={content} />
            <div className="mt-5 grid gap-3 text-sm">
              <div>
                <p className="text-xs font-bold uppercase text-muted">Cliente</p>
                <p className="mt-1 font-bold">{content.clients?.name ?? 'Senza cliente'}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-muted">Data prevista</p>
                <p className="mt-1 font-bold">{formatDate(content.scheduled_date)}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-muted">Date scheda</p>
                <div className="mt-2 grid gap-2 rounded-lg bg-white p-3 ring-1 ring-line">
                  <p className="flex items-start gap-2 text-xs text-slate-600"><CalendarClock className="mt-0.5 h-3.5 w-3.5" /><span><strong className="block text-ink">Creata</strong>{formatDateTime(content.created_at)}</span></p>
                  <p className="flex items-start gap-2 text-xs text-slate-600"><CalendarClock className="mt-0.5 h-3.5 w-3.5" /><span><strong className="block text-ink">Ultimo aggiornamento</strong>{formatDateTime(content.updated_at)}</span></p>
                </div>
              </div>
            </div>
          </aside>
          <div className="p-5">
            <ErrorState message={error} />
            <SuccessState message={success} />
            <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h3 className="text-lg font-black">{mode === 'edit' ? 'Correggi contenuto' : 'Controllo contenuto'}</h3>
                <p className="text-sm text-muted">Verifica copy, note operative, stato e pianificazione.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="btn-secondary" onClick={() => setMode(mode === 'edit' ? 'view' : 'edit')} disabled={Boolean(busyAction)}>
                  <Edit3 className="h-4 w-4" />
                  {mode === 'edit' ? 'Vista' : 'Modifica'}
                </button>
                <button className="btn-secondary" onClick={() => runAction('duplicate', () => onDuplicate(content), 'Contenuto duplicato in Idee.')} disabled={Boolean(busyAction)}>
                  <Copy className="h-4 w-4" />
                  {busyAction === 'duplicate' ? 'Duplico...' : 'Duplica'}
                </button>
                <button className="btn-danger" onClick={() => onDelete(content)} disabled={Boolean(busyAction)}>
                  <Trash2 className="h-4 w-4" />
                  Elimina
                </button>
              </div>
            </div>
            {mode === 'edit' ? (
              <ContentForm
                initialValue={content}
                clients={clients}
                saving={saving}
                userId={userId}
                onSubmit={onSubmit}
                onUpload={onUpload}
                onCancel={() => setMode('view')}
              />
            ) : (
              <div className="grid gap-5">
                <section className="rounded-lg border border-line p-4">
                  <p className="text-xs font-black uppercase tracking-wide text-muted">Copy/testo</p>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">{content.copy_text || 'Nessun copy inserito.'}</p>
                </section>
                <section className="rounded-lg border border-line p-4">
                  <p className="text-xs font-black uppercase tracking-wide text-muted">Note interne</p>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">{content.internal_notes || 'Nessuna nota interna.'}</p>
                </section>
                <section className="rounded-lg border border-line p-4">
                  <label className="text-sm font-bold">Cambia stato</label>
                  <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                    <select className="form-input sm:max-w-xs" value={content.status} onChange={(event) => runAction('status', () => onStatusChange(content.id, event.target.value), 'Stato aggiornato.')}>
                      {statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                    <button className="btn-secondary" onClick={() => setMode('edit')}>
                      <Save className="h-4 w-4" />
                      Correggi dettagli
                    </button>
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
