import { CalendarClock, X } from 'lucide-react';
import { formatDateTime } from '../../utils/date';
import Badge from '../ui/Badge.jsx';
import ContentForm from './ContentForm.jsx';
import ContentPreview from './ContentPreview.jsx';

export default function ContentDetailModal({ content, clients, saving, userId, onClose, onSubmit, onUpload }) {
  if (!content) return null;

  return (
    <div className="fixed inset-0 z-50 bg-ink/40 p-3 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true">
      <div className="ml-auto flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-white shadow-soft">
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
        <div className="grid flex-1 gap-0 overflow-y-auto lg:grid-cols-[18rem_1fr]">
          <aside className="border-b border-line bg-slate-50 p-5 lg:border-b-0 lg:border-r">
            <ContentPreview content={content} />
            <div className="mt-5 grid gap-3 text-sm">
              <div>
                <p className="text-xs font-bold uppercase text-muted">Cliente</p>
                <p className="mt-1 font-bold">{content.clients?.name ?? 'Senza cliente'}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-muted">Date scheda</p>
                <div className="mt-2 grid gap-2 rounded-lg bg-white p-3 ring-1 ring-line">
                  <p className="flex items-start gap-2 text-xs text-slate-600"><CalendarClock className="mt-0.5 h-3.5 w-3.5" /><span><strong className="block text-ink">Creata</strong>{formatDateTime(content.created_at)}</span></p>
                  <p className="flex items-start gap-2 text-xs text-slate-600"><CalendarClock className="mt-0.5 h-3.5 w-3.5" /><span><strong className="block text-ink">Ultima modifica</strong>{formatDateTime(content.updated_at)}</span></p>
                </div>
              </div>
              {content.copy_text && (
                <div>
                  <p className="text-xs font-bold uppercase text-muted">Copy attuale</p>
                  <p className="mt-1 line-clamp-6 rounded-lg bg-white p-3 text-sm leading-6 text-slate-700 ring-1 ring-line">{content.copy_text}</p>
                </div>
              )}
            </div>
          </aside>
          <div className="p-5">
            <ContentForm
              initialValue={content}
              clients={clients}
              saving={saving}
              userId={userId}
              onSubmit={onSubmit}
              onUpload={onUpload}
              onCancel={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
