import { Plus, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import ContentDetailModal from '../../components/contents/ContentDetailModal.jsx';
import ContentForm from '../../components/contents/ContentForm.jsx';
import ContentsTable from '../../components/contents/ContentsTable.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import PageTitle from '../../components/ui/PageTitle.jsx';
import SuccessState from '../../components/ui/SuccessState.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { deleteContent, listClients, listContents, updateContentStatus, upsertContent } from '../../lib/crmApi';
import { contentTypeOptions, platformOptions, statusOptions } from '../../lib/options';

export default function ContentsPage() {
  const { user } = useAuth();
  const [state, setState] = useState({ clients: [], contents: [], loading: true, error: '' });
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  const refresh = () => Promise.all([listClients(), listContents(filters)])
    .then(([clients, contents]) => setState({ clients, contents, loading: false, error: '' }))
    .catch((err) => setState((current) => ({ ...current, loading: false, error: err.message })));

  useEffect(() => { refresh(); }, [filters]);

  const filteredContents = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return state.contents;
    return state.contents.filter((content) =>
      [content.title, content.copy_text].some((value) => value?.toLowerCase().includes(query))
    );
  }, [state.contents, search]);

  const save = async (payload) => {
    setSaving(true);
    setSuccess('');
    try {
      const isEdit = Boolean(payload.id);
      await upsertContent({ ...payload, created_by: payload.created_by ?? user.id });
      setShowForm(false);
      setEditing(null);
      setSelectedContent(null);
      setSuccess(isEdit ? 'Contenuto aggiornato correttamente.' : 'Contenuto creato correttamente.');
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
      setSuccess('Contenuto eliminato correttamente.');
      await refresh();
    } catch (err) {
      setState((current) => ({ ...current, error: err.message }));
    }
  };

  if (state.loading) return <LoadingState />;

  return (
    <div>
      <PageTitle title="Contenuti" description="Archivio contenuti, bozze, stati e approvazioni." action={<button className="btn-primary" onClick={() => { setEditing(null); setShowForm(true); }}><Plus className="h-4 w-4" />Nuovo contenuto</button>} />
      <ErrorState message={state.error} />
      <SuccessState message={success} />
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
      </div>
      {showForm && <div className="mb-6"><ContentForm initialValue={editing} clients={state.clients} saving={saving} userId={user.id} onSubmit={save} onUpload={refresh} onCancel={() => { setShowForm(false); setEditing(null); }} /></div>}
      {filteredContents.length > 0 ? (
        <ContentsTable
          contents={filteredContents}
          onOpen={(content) => { setSelectedContent(content); setEditing(null); setShowForm(false); }}
          onEdit={(content) => { setSelectedContent(content); setEditing(null); setShowForm(false); }}
          onDelete={remove}
          onStatusChange={async (id, status) => {
            setSuccess('');
            setState((current) => ({ ...current, error: '' }));
            try {
              await updateContentStatus(id, status);
              setSuccess('Stato contenuto aggiornato.');
              await refresh();
            } catch (err) {
              setState((current) => ({ ...current, error: err.message }));
            }
          }}
        />
      ) : (
        <EmptyState title="Nessun contenuto trovato" description={state.contents.length === 0 ? 'Crea un contenuto e collegalo a un cliente.' : 'Prova a modificare ricerca o filtri.'} />
      )}
      <ContentDetailModal
        content={selectedContent}
        clients={state.clients}
        saving={saving}
        userId={user.id}
        onClose={() => setSelectedContent(null)}
        onSubmit={save}
        onUpload={refresh}
      />
    </div>
  );
}
