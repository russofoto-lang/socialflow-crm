import { Edit3, Trash2 } from 'lucide-react';
import { formatDate } from '../../utils/date';
import Badge from '../ui/Badge.jsx';

export default function ContentsTable({ contents, onEdit, onDelete, onStatusChange }) {
  return (
    <div className="surface overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Titolo</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Piattaforma</th>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Stato</th>
              <th className="px-4 py-3">Approvazione</th>
              <th className="px-4 py-3 text-right">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {contents.map((content) => (
              <tr key={content.id} className="transition hover:bg-slate-50">
                <td className="px-4 py-4">
                  <p className="font-bold">{content.title}</p>
                  {content.copy_text && <p className="mt-1 line-clamp-1 max-w-xs text-xs text-muted">{content.copy_text}</p>}
                </td>
                <td className="px-4 py-4 font-medium">{content.clients?.name ?? '-'}</td>
                <td className="px-4 py-4"><Badge type="contentType" value={content.content_type} /></td>
                <td className="px-4 py-4"><Badge type="platform" value={content.platform} /></td>
                <td className="px-4 py-4 text-muted">{formatDate(content.scheduled_date)}</td>
                <td className="px-4 py-4">
                  <select className="form-input min-w-40" value={content.status} onChange={(e) => onStatusChange(content.id, e.target.value)}>
                    <option value="ideas">Idee</option>
                    <option value="todo">Da fare</option>
                    <option value="in_progress">In lavorazione</option>
                    <option value="to_approve">Da approvare</option>
                    <option value="published">Pubblicato</option>
                  </select>
                </td>
                <td className="px-4 py-4"><Badge type="approval" value={content.approval_status} /></td>
                <td className="px-4 py-4 text-right">
                  <button className="inline-flex items-center gap-1 text-sm font-bold text-brand-700 hover:underline" onClick={() => onEdit(content)}><Edit3 className="h-3.5 w-3.5" />Modifica</button>
                  <button className="ml-4 inline-flex items-center gap-1 text-sm font-bold text-rose-700 hover:underline" onClick={() => onDelete(content)}><Trash2 className="h-3.5 w-3.5" />Elimina</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
