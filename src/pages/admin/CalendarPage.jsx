import { addDays, addMonths, format, startOfToday, subMonths } from 'date-fns';
import { it } from 'date-fns/locale';
import { useEffect, useMemo, useState } from 'react';
import CalendarMonthView from '../../components/calendar/CalendarMonthView.jsx';
import ContentDetailModal from '../../components/contents/ContentDetailModal.jsx';
import ContentForm from '../../components/contents/ContentForm.jsx';
import Badge from '../../components/ui/Badge.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import PageTitle from '../../components/ui/PageTitle.jsx';
import SuccessState from '../../components/ui/SuccessState.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import useContentActions from '../../hooks/useContentActions';
import { listClients, listContents, upsertContent } from '../../lib/crmApi';
import { statusOptions } from '../../lib/options';
import { formatDate, toDateKey } from '../../utils/date';

function ContentFormModal({ initialValue, clients, saving, userId, onSubmit, onCancel }) {
  if (!initialValue) return null;

  return (
    <div className="fixed inset-0 z-50 bg-ink/40 p-3 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true">
      <div className="ml-auto flex h-full w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-soft">
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-brand-700">Calendario editoriale</p>
            <h2 className="mt-1 text-xl font-black">{initialValue.id ? 'Modifica contenuto' : 'Nuovo contenuto'}</h2>
          </div>
          <button className="btn-secondary" onClick={onCancel}>Chiudi</button>
        </div>
        <div className="overflow-y-auto p-5">
          <ContentForm initialValue={initialValue} clients={clients} saving={saving} userId={userId} onSubmit={onSubmit} onCancel={onCancel} />
        </div>
      </div>
    </div>
  );
}

export default function CalendarPage() {
  const { user } = useAuth();
  const [state, setState] = useState({ clients: [], contents: [], loading: true, error: '' });
  const [filters, setFilters] = useState({});
  const [formContent, setFormContent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(toDateKey(new Date()));
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const refresh = () => Promise.all([listClients(), listContents(filters)])
    .then(([clients, contents]) => setState({ clients, contents, loading: false, error: '' }))
    .catch((err) => setState((current) => ({ ...current, loading: false, error: err.message })));

  useEffect(() => { refresh(); }, [filters]);

  const contentActions = useContentActions({
    userId: user.id,
    refresh,
    messages: {
      saveEdit: 'Contenuto aggiornato dal calendario.',
      saveCreate: 'Contenuto creato dal calendario.',
      delete: 'Contenuto eliminato dal calendario.',
      duplicate: 'Contenuto duplicato in Idee.',
      status: 'Stato contenuto aggiornato.'
    },
    onAfterSave: () => setFormContent(null)
  });

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

  const selectedDayContents = useMemo(
    () => scheduledContents.filter((content) => content.scheduled_date === selectedDate),
    [scheduledContents, selectedDate]
  );

  const selectToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(toDateKey(today));
  };

  const changeMonth = (date) => {
    setCurrentMonth(date);
    setSelectedDate(toDateKey(date));
  };

  const openCreateForDate = (date) => {
    setSelectedDate(date);
    setFormContent({ scheduled_date: date });
  };

  const openContent = (content) => {
    contentActions.openContentDetail(content);
    setFormContent(null);
    if (content.scheduled_date) setSelectedDate(content.scheduled_date);
  };

  const moveContentToDate = async (content, targetDate) => {
    if (!targetDate || content.scheduled_date === targetDate) {
      setSelectedDate(targetDate);
      return;
    }

    contentActions.setSuccess('');
    setState((current) => ({ ...current, error: '' }));
    try {
      const oldDateLabel = formatDate(content.scheduled_date);
      const newDateLabel = formatDate(targetDate);
      const timestamp = format(new Date(), 'dd MMM yyyy HH:mm', { locale: it });
      const moveNote = `[${timestamp}] Spostato nel calendario da ${oldDateLabel} a ${newDateLabel}.`;
      const updatedNotes = [content.internal_notes, moveNote].filter(Boolean).join('\n\n');
      const updated = await upsertContent({
        id: content.id,
        client_id: content.client_id,
        title: content.title,
        content_type: content.content_type,
        platform: content.platform,
        copy_text: content.copy_text,
        internal_notes: updatedNotes,
        scheduled_date: targetDate,
        status: content.status,
        approval_status: content.approval_status,
        created_by: content.created_by ?? user.id
      });
      setSelectedDate(targetDate);
      contentActions.setSelectedContent((current) => current?.id === content.id ? { ...current, ...updated, internal_notes: updatedNotes, scheduled_date: targetDate } : current);
      contentActions.setSuccess(`Contenuto spostato al ${newDateLabel}.`);
      await refresh();
    } catch (err) {
      setState((current) => ({ ...current, error: err.message }));
    }
  };

  if (state.loading) return <LoadingState />;

  return (
    <div>
      <PageTitle title="Calendario editoriale" description="Pianificazione mensile dei contenuti social." />
      <ErrorState message={state.error || contentActions.error} />
      <SuccessState message={contentActions.success} />

      <div className="surface mb-4 grid gap-4 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-brand-700">Mese visualizzato</p>
            <h2 className="text-xl font-black capitalize">{format(currentMonth, 'MMMM yyyy', { locale: it })}</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn-secondary" onClick={() => changeMonth(subMonths(currentMonth, 1))}>Mese precedente</button>
            <button className="btn-primary" onClick={selectToday}>Oggi</button>
            <button className="btn-secondary" onClick={() => changeMonth(addMonths(currentMonth, 1))}>Mese successivo</button>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <select className="form-input" value={filters.client_id ?? ''} onChange={(e) => setFilters((current) => ({ ...current, client_id: e.target.value || undefined }))}>
            <option value="">Tutti i clienti</option>
            {state.clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}
          </select>
          <select className="form-input" value={filters.status ?? ''} onChange={(e) => setFilters((current) => ({ ...current, status: e.target.value || undefined }))}>
            <option value="">Tutti gli stati</option>
            {statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </div>
      </div>

      <section className="surface mb-4 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="section-title">Prossimi 7 giorni</h2>
          <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-black text-slate-600">{nextSevenDays.length}</span>
        </div>
        {nextSevenDays.length > 0 ? (
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
            {nextSevenDays.slice(0, 8).map((content) => (
              <button key={content.id} className="rounded-lg border border-line bg-white p-3 text-left transition hover:border-brand-200 hover:bg-brand-50" onClick={() => openContent(content)}>
                <p className="text-xs font-black text-brand-700">{formatDate(content.scheduled_date)}</p>
                <p className="mt-1 truncate text-sm font-bold">{content.title}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  <Badge type="platform" value={content.platform} />
                  <Badge value={content.status} />
                </div>
              </button>
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-muted">Nessun contenuto nei prossimi 7 giorni.</p>
        )}
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <CalendarMonthView
          contents={state.contents}
          date={currentMonth}
          selectedDate={selectedDate}
          onDayClick={setSelectedDate}
          onContentClick={openContent}
          onContentMove={moveContentToDate}
        />
        <aside className="surface p-4">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-brand-700">Giorno selezionato</p>
              <h2 className="mt-1 text-lg font-black">{formatDate(selectedDate)}</h2>
            </div>
            <button className="btn-primary whitespace-nowrap" onClick={() => openCreateForDate(selectedDate)}>Nuovo</button>
          </div>
          <div className="grid gap-3">
            {selectedDayContents.map((content) => (
              <button key={content.id} className="rounded-lg border border-line bg-white p-3 text-left shadow-sm transition hover:border-brand-200 hover:bg-brand-50" onClick={() => openContent(content)}>
                <p className="truncate font-bold">{content.title}</p>
                <p className="mt-1 text-sm text-muted">{content.clients?.name ?? 'Senza cliente'}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge type="platform" value={content.platform} />
                  <Badge type="contentType" value={content.content_type} />
                  <Badge value={content.status} />
                </div>
              </button>
            ))}
            {selectedDayContents.length === 0 && (
              <EmptyState
                title="Nessun contenuto programmato per questo giorno."
                description="Puoi crearne uno direttamente da qui con la data gia impostata."
                action={<button className="btn-primary" onClick={() => openCreateForDate(selectedDate)}>Crea contenuto</button>}
              />
            )}
          </div>
        </aside>
      </div>

      <ContentFormModal
        initialValue={formContent}
        clients={state.clients}
        saving={contentActions.saving}
        userId={user.id}
        onSubmit={contentActions.saveContent}
        onCancel={() => setFormContent(null)}
      />
      <ContentDetailModal
        content={contentActions.selectedContent}
        clients={state.clients}
        saving={contentActions.saving}
        userId={user.id}
        onClose={contentActions.closeContentDetail}
        onSubmit={contentActions.saveContent}
        onUpload={refresh}
        onDuplicate={contentActions.duplicateContent}
        onStatusChange={contentActions.changeContentStatus}
        onDelete={contentActions.deleteContent}
      />
    </div>
  );
}
