import { addDays, addMonths, format, startOfToday, subMonths } from 'date-fns';
import { it } from 'date-fns/locale';
import { useEffect, useMemo, useState } from 'react';
import CalendarMonthView from '../../components/calendar/CalendarMonthView.jsx';
import ContentPreview from '../../components/contents/ContentPreview.jsx';
import ContentForm from '../../components/contents/ContentForm.jsx';
import Badge from '../../components/ui/Badge.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import PageTitle from '../../components/ui/PageTitle.jsx';
import SuccessState from '../../components/ui/SuccessState.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { listClients, listContents, upsertContent } from '../../lib/crmApi';
import { statusOptions } from '../../lib/options';
import { formatDate } from '../../utils/date';

export default function CalendarPage() {
  const { user } = useAuth();
  const [state, setState] = useState({ clients: [], contents: [], loading: true, error: '' });
  const [filters, setFilters] = useState({});
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const refresh = () => Promise.all([listClients(), listContents(filters)])
    .then(([clients, contents]) => setState({ clients, contents, loading: false, error: '' }))
    .catch((err) => setState((current) => ({ ...current, loading: false, error: err.message })));

  useEffect(() => { refresh(); }, [filters]);

  const scheduledContents = useMemo(
    () => [...state.contents].filter((content) => content.scheduled_date).sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date)),
    [state.contents]
  );

  const nextSevenDays = useMemo(() => {
    const today = startOfToday();
    const limit = addDays(today, 7);
    return scheduledContents.filter((content) => {
      const date = new Date(`${content.scheduled_date}T00:00:00`);
      return date >= today && date <= limit;
    });
  }, [scheduledContents]);

  const save = async (payload) => {
    setSuccess('');
    setState((current) => ({ ...current, error: '' }));
    try {
      const isEdit = Boolean(payload.id);
      await upsertContent({ ...payload, created_by: payload.created_by ?? user.id });
      setShowForm(false);
      setEditing(null);
      setSuccess(isEdit ? 'Contenuto aggiornato dal calendario.' : 'Contenuto creato dal calendario.');
      await refresh();
    } catch (err) {
      setState((current) => ({ ...current, error: err.message }));
    }
  };

  if (state.loading) return <LoadingState />;

  return (
    <div>
      <PageTitle title="Calendario editoriale" description="Pianificazione mensile dei contenuti social." />
      <ErrorState message={state.error} />
      <SuccessState message={success} />
      <div className="surface mb-4 grid gap-4 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-brand-700">Mese visualizzato</p>
            <h2 className="text-xl font-black capitalize">{format(currentMonth, 'MMMM yyyy', { locale: it })}</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn-secondary" onClick={() => setCurrentMonth((date) => subMonths(date, 1))}>Mese precedente</button>
            <button className="btn-primary" onClick={() => setCurrentMonth(new Date())}>Oggi</button>
            <button className="btn-secondary" onClick={() => setCurrentMonth((date) => addMonths(date, 1))}>Mese successivo</button>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <select className="form-input" value={filters.client_id ?? ''} onChange={(e) => setFilters((f) => ({ ...f, client_id: e.target.value || undefined }))}><option value="">Tutti i clienti</option>{state.clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}</select>
          <select className="form-input" value={filters.status ?? ''} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value || undefined }))}><option value="">Tutti gli stati</option>{statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
        </div>
      </div>
      {showForm && <div className="mb-6"><ContentForm initialValue={editing} clients={state.clients} userId={user.id} onSubmit={save} onCancel={() => { setShowForm(false); setEditing(null); }} /></div>}
      <section className="surface mb-6 p-5">
        <h2 className="section-title mb-4">Prossimi 7 giorni</h2>
        <div className="grid gap-3">
          {nextSevenDays.map((content) => (
            <button key={content.id} className="premium-card flex flex-col gap-3 p-4 text-left sm:flex-row sm:items-center sm:justify-between" onClick={() => { setEditing(content); setShowForm(true); }}>
              <div>
                <p className="text-sm font-black">{formatDate(content.scheduled_date)}</p>
                <p className="mt-1 font-bold">{content.title}</p>
                <p className="text-sm text-muted">{content.clients?.name}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge type="platform" value={content.platform} />
                <Badge value={content.status} />
              </div>
            </button>
          ))}
          {nextSevenDays.length === 0 && <EmptyState title="Nessun contenuto nei prossimi 7 giorni" description="Quando pianifichi contenuti imminenti li vedrai qui, pronti da controllare." />}
        </div>
      </section>
      <CalendarMonthView contents={state.contents} date={currentMonth} onDayClick={(date) => { setEditing({ scheduled_date: date }); setShowForm(true); }} onContentClick={(content) => { setEditing(content); setShowForm(true); }} />
      <section className="surface mt-6 p-5">
        <h2 className="section-title mb-4">Lista contenuti programmati</h2>
        <div className="grid gap-3">
          {scheduledContents.map((content) => (
            <button key={content.id} className="premium-card flex flex-col gap-3 p-4 text-left sm:flex-row sm:items-center sm:justify-between" onClick={() => { setEditing(content); setShowForm(true); }}>
              <div className="flex min-w-0 gap-3">
                <ContentPreview content={content} compact />
                <div className="min-w-0">
                  <p className="truncate font-bold">{content.title}</p>
                  <p className="mt-1 text-sm text-muted">{content.clients?.name} - {formatDate(content.scheduled_date)}</p>
                  {content.copy_text && <p className="mt-1 line-clamp-1 text-xs text-muted">{content.copy_text}</p>}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge type="platform" value={content.platform} />
                <Badge type="contentType" value={content.content_type} />
                <Badge value={content.status} />
              </div>
            </button>
          ))}
          {scheduledContents.length === 0 && <EmptyState title="Nessun contenuto programmato" description="Aggiungi una data prevista a un contenuto per vederlo nel calendario." />}
        </div>
      </section>
    </div>
  );
}
