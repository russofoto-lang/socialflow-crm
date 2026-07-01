import { Plus, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ContentDetailModal from '../../components/contents/ContentDetailModal.jsx';
import ContentForm from '../../components/contents/ContentForm.jsx';
import ContentsTable from '../../components/contents/ContentsTable.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import PageTitle from '../../components/ui/PageTitle.jsx';
import SuccessState from '../../components/ui/SuccessState.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import useContentActions from '../../hooks/useContentActions';
import { getContent, listClients, listContents } from '../../lib/crmApi';
import { contentTypeOptions, platformOptions, statusOptions } from '../../lib/options';

export default function ContentsPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, setState] = useState({ clients: [], contents: [], loading: true, error: '' });
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date_asc');
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const refresh = () => Promise.all([listClients(), listContents(filters)])
    .then(([clients, contents]) => setState({ clients, contents, loading: false, error: '' }))
    .catch((err) => setState((current) => ({ ...current, loading: false, error: err.message })));

  const contentActions = useContentActions({
    userId: user.id,
    refresh,
    messages: {
      saveEdit: 'Contenuto aggiornato correttamente.',
      saveCreate: 'Contenuto creato correttamente.',
      delete: 'Contenuto eliminato correttamente.',
      duplicate: 'Contenuto duplicato correttamente in Idee.',
      status: 'Stato contenuto aggiornato.'
    },
    onAfterSave: () => {
      setShowForm(false);
      setEditing(null);
      contentActions.closeContentDetail();
    },
    onAfterDelete: () => contentActions.closeContentDetail()
  });

  useEffect(() => {
    const clientId = searchParams.get('client_id');
    if (clientId) setFilters((current) => ({ ...current, client_id: clientId }));
  }, [searchParams]);

  useEffect(() => { refresh(); }, [filters]);

  useEffect(() => {
    const contentId = searchParams.get('content');
    if (!contentId || state.loading) return;
    const inList = state.contents.find((content) => content.id === contentId);
    if (inList) {
      contentActions.openContentDetail(inList);
      return;
    }
    getContent(contentId)
      .then(contentActions.openContentDetail)
      .catch((err) => setState((current) => ({ ...current, error: err.message })));
  }, [searchParams, state.contents, state.loading]);

  const filteredContents = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = query ? state.contents.filter((content) =>
      [content.title, content.copy_text].some((value) => value?.toLowerCase().includes(query))
    ) : state.contents;

    return [...filtered].sort((a, b) => {
      if (sortBy === 'date_desc') return new Date(b.scheduled_date ?? 0) - new Date(a.scheduled_date ?? 0);
      if (sortBy === 'platform') return (a.platform ?? '').localeCompare(b.platform ?? '');
      if (sortBy === 'type') return (a.content_type ?? '').localeCompare(b.content_type ?? '');
      if (sortBy === 'status') return (a.status ?? '').localeCompare(b.status ?? '');
      return new Date(a.scheduled_date ?? '9999-12-31') - new Date(b.scheduled_date ?? '9999-12-31');
    });
  }, [state.contents, search, sortBy]);

  if (state.loading) return <LoadingState />;

  return (
    <div>
      <PageTitle title="Contenuti" description="Archivio contenuti, bozze, stati e approvazioni." action={<button className="btn-primary" onClick={() => { setEditing(null); setShowForm(true); }}><Plus className="h-4 w-4" />Nuovo contenuto</button>} />
      <ErrorState message={state.error || contentActions.error} />
      <SuccessState message={contentActions.success} />
      <div className="surface mb-4 grid gap-3 p-4 md:grid-cols-6">
        <label className="relative md:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input className="form-input pl-9" placeholder="Cerca titolo o copy..." value={search} onChange={(event) => setSearch(event.target.value)} />
        </label>
        <select className="form-input" value={filters.client_id ?? ''} onChange={(e) => setFilters((f) => ({ ...f, client_id: e.target.value || undefined }))}><option value="">Tutti i clienti</option>{state.clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}</select>
        <select className="form-input" value={filters.status ?? ''} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value || undefined }))}><option value="">Tutti gli stati</option>{statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
        <select className="form-input" value={filters.content_type ?? ''} onChange={(e) => setFilters((f) => ({ ...f, content_type: e.target.value || undefined }))}><option value="">Tutti i tipi</option>{contentTypeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
        <select className="form-input" value={filters.platform ?? ''} onChange={(e) => setFilters((f) => ({ ...f, platform: e.target.value || undefined }))}><option value="">Tutte le piattaforme</option>{platformOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
        <input className="form-input md:col-span-2" type="date" value={filters.scheduled_date ?? ''} onChange={(e) => setFilters((f) => ({ ...f, scheduled_date: e.target.value || undefined }))} />
        <select className="form-input md:col-span-2" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
          <option value="date_asc">Ordina per data: piu vicini prima</option>
          <option value="date_desc">Ordina per data: piu lontani prima</option>
          <option value="platform">Ordina per piattaforma</option>
          <option value="type">Ordina per tipo</option>
          <option value="status">Ordina per stato</option>
        </select>
      </div>
      {showForm && <div className="mb-6"><ContentForm initialValue={editing} clients={state.clients} saving={contentActions.saving} userId={user.id} onSubmit={contentActions.saveContent} onUpload={refresh} onCancel={() => { setShowForm(false); setEditing(null); }} /></div>}
      {filteredContents.length > 0 ? (
        <ContentsTable
          contents={filteredContents}
          onOpen={(content) => { contentActions.openContentDetail(content); setEditing(null); setShowForm(false); }}
          onEdit={(content) => { contentActions.openContentDetail(content); setEditing(null); setShowForm(false); }}
          onDelete={contentActions.deleteContent}
          onStatusChange={async (id, status) => {
            setState((current) => ({ ...current, error: '' }));
            try {
              await contentActions.changeContentStatus(id, status);
            } catch (err) {
              setState((current) => ({ ...current, error: err.message }));
            }
          }}
        />
      ) : (
        <EmptyState title="Nessun contenuto trovato" description={state.contents.length === 0 ? 'Crea un contenuto e collegalo a un cliente.' : 'Prova a modificare ricerca o filtri.'} />
      )}
      <ContentDetailModal
        content={contentActions.selectedContent}
        clients={state.clients}
        saving={contentActions.saving}
        userId={user.id}
        onClose={() => { contentActions.closeContentDetail(); setSearchParams({}); }}
        onSubmit={contentActions.saveContent}
        onUpload={refresh}
        onDuplicate={contentActions.duplicateContent}
        onStatusChange={contentActions.changeContentStatus}
        onDelete={contentActions.deleteContent}
      />
    </div>
  );
}
