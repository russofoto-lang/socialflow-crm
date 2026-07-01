import { CalendarDays } from 'lucide-react';
import { formatDate } from '../../utils/date';
import ContentPreview from '../contents/ContentPreview.jsx';
import Badge from '../ui/Badge.jsx';

export default function BoardCard({ content, onOpen, onStatusChange }) {
  return (
    <article
      className="premium-card cursor-pointer p-3 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-soft"
      role="button"
      tabIndex={0}
      onClick={() => onOpen?.(content)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpen?.(content);
        }
      }}
    >
      <ContentPreview content={content} />
      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-black leading-5">{content.title}</h3>
          <p className="mt-1 truncate text-xs font-semibold text-muted">{content.clients?.name ?? 'Senza cliente'}</p>
        </div>
        {content.status === 'to_approve' && <span className="shrink-0 rounded-md bg-violet-100 px-2 py-1 text-[11px] font-black text-violet-700">review</span>}
      </div>
      {content.copy_text && <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600">{content.copy_text}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge type="platform" value={content.platform} />
        <Badge type="contentType" value={content.content_type} />
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-slate-600"><CalendarDays className="h-3.5 w-3.5" />{formatDate(content.scheduled_date)}</p>
      <select
        className="form-input mt-3"
        value={content.status}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
        onChange={(e) => onStatusChange(content.id, e.target.value)}
      >
        <option value="ideas">Idee</option>
        <option value="todo">Da fare</option>
        <option value="in_progress">In lavorazione</option>
        <option value="to_approve">Da approvare</option>
        <option value="published">Pubblicato</option>
      </select>
    </article>
  );
}
