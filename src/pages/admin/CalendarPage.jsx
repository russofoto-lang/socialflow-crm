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
import { deleteContent, duplicateContent, listClients, listContents, updateContentStatus, uploadContentFile, upsertContent } from '../../lib/crmApi';
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
  const [selectedContent, setSelectedContent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(toDateKey(new Date()));
  const [saving, setSaving] = useState(false);
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

  const selectedDayContents = useMemo(
    () => scheduledContents.filter((content) => content.scheduled_date === selectedDate),
    [scheduledContents, selectedDate]
  );

  const save = async (payload) => {
    setSaving(true);
    setSuccess('');
    setState((current) => ({ ...current, error: '' }));
    try {
      const isEdit = Boolean(payload.id);
      const { pendingFile, ...contentPayload } = payload;
      const saved = await upsertContent({ ...contentPayload, created_by: contentPayload.created_by ?? user.id });
      if (pendingFile) await uploadContentFile({ contentId: saved.id, file: pendingFile, userId: user.id });
      setFormContent(null);
      setSelectedContent((current) => current?.id === saved.id ? { ...current, ...saved } : current);
      setSuccess(isEdit ? 'Contenuto aggiornato dal calendario.' : 'Contenuto creato dal calendario.');
      await refresh();
    } catch (err) {
      setState((current) => ({ ...current, error: err.message }));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (content) => {
    const confirmed = window.confirm(`Eliminare il contenuto "${content.title}"? Questa azione non puo essere annullata.`);
    if (!confirmed) return;
    setSuccess('');
    setState((current) => ({ ...current, error: '' }));
    try {
      await deleteContent(content.id);
      setSelectedContent(null);
      setSuccess('Contenuto eliminato dal calendario.');
      await refresh();
    } catch (err) {
      setState((current) => ({ ...current, error: err.message }));
    }
  };

  const duplicate = async (content) => {
    setSuccess('');
    setState((current) => ({ ...current, error: '' }));
    try {
      await duplicateContent(content, user.id);
      setSuccess('Contenuto duplicato in Idee.');
      await refresh();
    } catch (err) {
      setState((current) => ({ ...current, error: err.message }));
    }
  };

  const changeStatus = async (id, status) => {
    setSuccess('');
    setState((current) => ({ ...current, error: '' }));
    try {
      const updated = await updateContentStatus(id, status);
      setSelectedContent((current) => current?.id === id ? { ...current, ...updated, status } : current);
      setSuccess('Stato contenuto aggiornato.');
      await refresh();
    } catch (err) {
      setState((current) => ({ ...current, error: err.message }));
    }
  };

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
    setSelectedContent(content);
    setFormContent(null);
    if (content.scheduled_date) setSelectedDate(content.scheduled_date);
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
        saving={saving}
        userId={user.id}
        onSubmit={save}
        onCancel={() => setFormContent(null)}
      />
      <ContentDetailModal
        content={selectedContent}
        clients={state.clients}
        saving={saving}
        userId={user.id}
        onClose={() => setSelectedContent(null)}
        onSubmit={save}
        onUpload={refresh}
        onDuplicate={duplicate}
        onStatusChange={changeStatus}
        onDelete={remove}
      />
    </div>
  );
}
