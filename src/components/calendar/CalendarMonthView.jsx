import { format, isToday } from 'date-fns';
import { it } from 'date-fns/locale';
import { buildMonthDays, formatDate } from '../../utils/date';
import Badge from '../ui/Badge.jsx';

export default function CalendarMonthView({ contents, date = new Date(), selectedDate, onDayClick, onContentClick }) {
  const month = buildMonthDays(date);
  const byDate = contents.reduce((acc, item) => {
    if (!item.scheduled_date) return acc;
    acc[item.scheduled_date] = [...(acc[item.scheduled_date] ?? []), item];
    return acc;
  }, {});

  return (
    <div className="surface overflow-hidden">
      <div className="border-b border-line px-4 py-3">
        <h2 className="text-lg font-black capitalize">{month.label}</h2>
        <p className="mt-1 text-xs font-medium text-muted">Clicca su un giorno per vedere l'agenda editoriale.</p>
      </div>
      <div className="hidden grid-cols-7 border-b border-line bg-slate-50 text-center text-xs font-bold uppercase text-muted sm:grid">
        {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map((day) => <div key={day} className="py-2">{day}</div>)}
      </div>
      <div className="hidden grid-cols-1 sm:grid sm:grid-cols-7">
        {month.days.map((day) => {
          const dayContents = byDate[day.key] ?? [];
          const isSelected = selectedDate === day.key;
          return (
            <button
              key={day.key}
              className={`min-h-24 border-b border-r border-line p-2 text-left align-top transition hover:bg-brand-50 ${day.inMonth ? 'bg-white' : 'bg-slate-50 text-slate-400'} ${isSelected ? 'bg-brand-50 ring-2 ring-inset ring-brand-500' : ''}`}
              onClick={() => onDayClick?.(day.key)}
            >
              <div className="flex items-center justify-between">
                <span className={`grid h-6 min-w-6 place-items-center rounded-md px-1 text-xs font-black ${isToday(day.date) ? 'bg-ink text-white' : ''}`}>{format(day.date, 'd')}</span>
                {dayContents.length > 0 && <span className="rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-black text-brand-700">{dayContents.length}</span>}
              </div>
              <div className="mt-2 grid gap-1">
                {dayContents.slice(0, 2).map((content) => (
                  <span
                    key={content.id}
                    className="rounded-md border border-line bg-white px-2 py-1.5 text-xs shadow-sm transition hover:border-brand-200 hover:bg-white"
                    onClick={(event) => {
                      event.stopPropagation();
                      onContentClick?.(content);
                    }}
                  >
                    <strong className="block truncate">{content.title}</strong>
                    <span className="mt-1 flex flex-wrap gap-1"><Badge type="platform" value={content.platform} /></span>
                  </span>
                ))}
                {dayContents.length > 2 && <span className="text-[11px] font-bold text-brand-700">+ altri {dayContents.length - 2}</span>}
              </div>
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-7 gap-1 p-3 sm:hidden">
        {month.days.map((day) => {
          const dayContents = byDate[day.key] ?? [];
          const isSelected = selectedDate === day.key;
          return (
          <button
            key={day.key}
            className={`min-h-12 rounded-md border border-line p-1 text-center transition hover:bg-brand-50 ${day.inMonth ? 'bg-white' : 'bg-slate-50 text-slate-400'} ${isSelected ? 'border-brand-500 bg-brand-50 text-brand-800' : ''}`}
            onClick={() => onDayClick?.(day.key)}
          >
            <span className="block text-xs font-black">{format(day.date, 'd')}</span>
            {dayContents.length > 0 && <span className="mx-auto mt-1 block h-1.5 w-1.5 rounded-full bg-brand-600" />}
          </button>
          );
        })}
      </div>
      {!selectedDate && (
        <div className="grid gap-2 p-3 pt-0 sm:hidden">
          {contents.filter((content) => content.scheduled_date).length === 0 && (
            <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-muted">Nessun contenuto programmato.</div>
          )}
          {contents.filter((content) => content.scheduled_date).map((content) => (
            <button
              key={content.id}
              className="rounded-lg border border-line bg-white p-3 text-left shadow-sm"
              onClick={() => onContentClick?.(content)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-black">{content.title}</p>
                  <p className="mt-1 text-xs text-muted">{formatDate(content.scheduled_date)} - {content.clients?.name}</p>
                </div>
                <Badge type="platform" value={content.platform} />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
