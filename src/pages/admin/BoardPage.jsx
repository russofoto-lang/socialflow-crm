import { useEffect, useMemo, useState } from 'react';
import BoardColumn from '../../components/board/BoardColumn.jsx';
import ContentDetailModal from '../../components/contents/ContentDetailModal.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import PageTitle from '../../components/ui/PageTitle.jsx';
import SuccessState from '../../components/ui/SuccessState.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { deleteContent, duplicateContent, listClients, listContents, updateContentStatus, upsertContent } from '../../lib/crmApi';
import { statusOptions } from '../../lib/options';

export default function BoardPage() {
  const { user } = useAuth();
  const [contents, setContents] = useState([]);
  const [clients, setClients] = useState([]);
  const [clientFilter, setClientFilter] = useState('');
  const [selectedContent, setSelectedContent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const refresh = () => Promise.all([listContents(), listClients()])
    .then(([nextContents, nextClients]) => {
      setContents(nextContents);
      setClients(nextClients);
    })
    .catch((err) => setError(err.message))
    .finally(() => setLoading(false));

  useEffect(() => { refresh(); }, []);

  const visibleContents = useMemo(
    () => clientFilter ? contents.filter((content) => content.client_id === clientFilter) : contents,
    [contents, clientFilter]
  );

  const save = async (payload) => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const saved = await upsertContent({ ...payload, created_by: payload.created_by ?? user.id });
      setSelectedContent((current) => current?.id === saved.id ? { ...current, ...saved } : current);
      setSuccess('Contenuto aggiornato.');
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (content) => {
    const confirmed = window.confirm(`Eliminare il contenuto "${content.title}"? Questa azione non puo essere annullata.`);
    if (!confirmed) return;
    setError('');
    setSuccess('');
    try {
      await deleteContent(content.id);
      setSelectedContent(null);
      setSuccess('Contenuto eliminato.');
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  };

  const duplicate = async (content) => {
    setError('');
    setSuccess('');
    try {
      await duplicateContent(content, user.id);
      setSuccess('Contenuto duplicato in Idee.');
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  };

  const changeStatus = async (id, value) => {
    setError('');
    setSuccess('');
    try {
      const updated = await updateContentStatus(id, value);
      setSelectedContent((current) => current?.id === id ? { ...current, ...updated, status: value } : current);
      setSuccess('Stato contenuto aggiornato.');
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div>
      <PageTitle title="Board" description="Centro operativo per seguire lo stato dei contenuti senza drag and drop." />
      <ErrorState message={error} />
      <SuccessState message={success} />
      <div className="surface mb-4 flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold">Filtro rapido cliente</p>
          <p className="text-xs text-muted">Riduci la board a un solo cliente quando serve concentrazione.</p>
        </div>
        <select className="form-input sm:max-w-xs" value={clientFilter} onChange={(event) => setClientFilter(event.target.value)}>
          <option value="">Tutti i clienti</option>
          {clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}
        </select>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {statusOptions.map((status) => (
          <BoardColumn
            key={status.value}
            title={status.label}
            contents={visibleContents.filter((content) => content.status === status.value)}
            onOpen={setSelectedContent}
            onStatusChange={changeStatus}
          />
        ))}
      </div>
      <ContentDetailModal
        content={selectedContent}
        clients={clients}
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
