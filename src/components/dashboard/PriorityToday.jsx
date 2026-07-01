import { AlertTriangle, CalendarDays, CheckCircle2, FileWarning, ImageOff, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Badge from '../ui/Badge.jsx';
import EmptyState from '../ui/EmptyState.jsx';
import { formatDate } from '../../utils/date';

const sectionMeta = {
  overdue: { label: 'Contenuti in ritardo', tag: 'Urgente', icon: AlertTriangle, tone: 'text-rose-700 bg-rose-50 ring-rose-100' },
  today: { label: 'Contenuti previsti oggi', tag: 'Oggi', icon: CalendarDays, tone: 'text-brand-700 bg-brand-50 ring-brand-100' },
  approval: { label: 'Da approvare', tag: 'Da seguire', icon: CheckCircle2, tone: 'text-violet-700 bg-violet-50 ring-violet-100' },
  missingCopy: { label: 'Senza copy', tag: 'Bloccato', icon: FileWarning, tone: 'text-amber-700 bg-amber-50 ring-amber-100' },
  missingMedia: { label: 'Senza file/media', tag: 'Mancante', icon: ImageOff, tone: 'text-orange-700 bg-orange-50 ring-orange-100' },
  uncoveredClients: { label: 'Clienti scoperti', tag: 'Da seguire', icon: Users, tone: 'text-slate-700 bg-slate-100 ring-slate-200' }
};

function ContentLine({ content, onOpen }) {
  return (
    <button className="w-full rounded-lg border border-line bg-white p-3 text-left transition hover:border-brand-200 hover:bg-brand-50" onClick={() => onOpen(content)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-black">{content.title}</p>
          <p className="mt-1 text-xs text-muted">{content.clients?.name || 'Senza cliente'} - {formatDate(content.scheduled_date)}</p>
        </div>
        <Badge value={content.status} />
      </div>
    </button>
  );
}

function ClientLine({ client }) {
  return (
    <Link className="block rounded-lg border border-line bg-white p-3 transition hover:border-brand-200 hover:bg-brand-50" to={`/admin/clienti/${client.id}`}>
      <p className="truncate text-sm font-black">{client.name}</p>
      <p className="mt-1 text-xs text-muted">Nessun contenuto programmato nei prossimi 7 giorni</p>
    </Link>
  );
}

function PriorityBlock({ type, items, onOpenContent }) {
  const meta = sectionMeta[type];
  const Icon = meta.icon;
  const visibleItems = items.slice(0, 3);
  if (items.length === 0) return null;

  return (
    <article className="rounded-xl border border-line bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ring-1 ${meta.tone}`}>
            <Icon className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-black">{meta.label}</h3>
            <p className="text-xs text-muted">{items.length} elemento{items.length === 1 ? '' : 'i'}</p>
          </div>
        </div>
        <span className={`shrink-0 rounded-md px-2 py-1 text-[11px] font-black ring-1 ${meta.tone}`}>{meta.tag}</span>
      </div>
      <div className="grid gap-2">
        {visibleItems.map((item) => type === 'uncoveredClients'
          ? <ClientLine key={item.id} client={item} />
          : <ContentLine key={item.id} content={item} onOpen={onOpenContent} />
        )}
      </div>
      {items.length > visibleItems.length && (
        <Link className="mt-3 inline-flex text-xs font-bold text-brand-700 hover:underline" to={type === 'uncoveredClients' ? '/admin/clienti' : '/admin/contenuti'}>
          Vedi altri {items.length - visibleItems.length}
        </Link>
      )}
    </article>
  );
}

export default function PriorityToday({ priorities, onOpenContent }) {
  const total = Object.values(priorities).reduce((sum, items) => sum + items.length, 0);

  return (
    <section className="surface mb-6 p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-brand-700">Priorita di oggi</p>
          <h2 className="mt-1 text-2xl font-black">Cosa richiede attenzione adesso</h2>
        </div>
        <Link className="text-sm font-bold text-brand-700 hover:underline" to="/admin/calendario">Apri calendario</Link>
      </div>
      {total === 0 ? (
        <EmptyState title="Tutto sotto controllo per oggi." description="Non ci sono contenuti urgenti, mancanti o clienti scoperti nei prossimi giorni." />
      ) : (
        <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
          <PriorityBlock type="overdue" items={priorities.overdue} onOpenContent={onOpenContent} />
          <PriorityBlock type="today" items={priorities.today} onOpenContent={onOpenContent} />
          <PriorityBlock type="approval" items={priorities.approval} onOpenContent={onOpenContent} />
          <PriorityBlock type="missingCopy" items={priorities.missingCopy} onOpenContent={onOpenContent} />
          <PriorityBlock type="missingMedia" items={priorities.missingMedia} onOpenContent={onOpenContent} />
          <PriorityBlock type="uncoveredClients" items={priorities.uncoveredClients} onOpenContent={onOpenContent} />
        </div>
      )}
    </section>
  );
}
