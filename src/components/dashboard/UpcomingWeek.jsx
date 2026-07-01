import { AlertCircle } from 'lucide-react';
import Badge from '../ui/Badge.jsx';
import EmptyState from '../ui/EmptyState.jsx';
import { formatDate } from '../../utils/date';

export default function UpcomingWeek({ contents, onOpenContent }) {
  return (
    <section className="surface p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-brand-700">Prossimi 7 giorni</p>
          <h2 className="section-title">Calendario operativo</h2>
        </div>
      </div>
      <div className="grid gap-3">
        {contents.map((content) => {
          const missingCopy = !content.copy_text?.trim();
          const missingMedia = (content.content_files ?? []).length === 0;
          return (
            <button key={content.id} className="rounded-xl border border-line bg-white p-3 text-left transition hover:border-brand-200 hover:bg-brand-50" onClick={() => onOpenContent(content)}>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase text-muted">{formatDate(content.scheduled_date)}</p>
                  <p className="mt-1 truncate font-black">{content.title}</p>
                  <p className="mt-1 text-sm text-muted">{content.clients?.name || 'Senza cliente'}</p>
                </div>
                <div className="flex flex-wrap gap-2 lg:justify-end">
                  <Badge type="platform" value={content.platform} />
                  <Badge value={content.status} />
                </div>
              </div>
              {(missingCopy || missingMedia) && (
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-amber-700">
                  {missingCopy && <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 ring-1 ring-amber-100"><AlertCircle className="h-3.5 w-3.5" />Copy mancante</span>}
                  {missingMedia && <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 ring-1 ring-amber-100"><AlertCircle className="h-3.5 w-3.5" />Media mancante</span>}
                </div>
              )}
            </button>
          );
        })}
        {contents.length === 0 && <EmptyState title="Nessun contenuto programmato" description="I contenuti dei prossimi 7 giorni compariranno qui." />}
      </div>
    </section>
  );
}
