import { CalendarDays } from 'lucide-react';
import { formatDate } from '../../utils/date';
import Badge from '../ui/Badge.jsx';

export default function BoardCard({ content, onStatusChange }) {
  return (
    <article className="rounded-lg border border-line bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-black leading-5">{content.title}</h3>
        {content.status === 'to_approve' && <span className="rounded-md bg-amber-100 px-2 py-1 text-[11px] font-black text-amber-700">da approvare</span>}
      </div>
      <p className="mt-1 text-xs font-semibold text-muted">{content.clients?.name ?? 'Senza cliente'}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge type="contentType" value={content.content_type} />
        <Badge type="platform" value={content.platform} />
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-slate-600"><CalendarDays className="h-3.5 w-3.5" />{formatDate(content.scheduled_date)}</p>
      <select className="form-input mt-3" value={content.status} onChange={(e) => onStatusChange(content.id, e.target.value)}>
        <option value="ideas">Idee</option>
        <option value="todo">Da fare</option>
        <option value="in_progress">In lavorazione</option>
        <option value="to_approve">Da approvare</option>
        <option value="published">Pubblicato</option>
      </select>
    </article>
  );
}
