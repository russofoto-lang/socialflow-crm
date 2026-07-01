import { Plus, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import ClientForm from '../../components/clients/ClientForm.jsx';
import ClientsTable from '../../components/clients/ClientsTable.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import PageTitle from '../../components/ui/PageTitle.jsx';
import SuccessState from '../../components/ui/SuccessState.jsx';
import { deleteClient, listClients, updateClientStatus, upsertClient } from '../../lib/crmApi';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const refresh = () => listClients().then(setClients).catch((err) => setError(err.message)).finally(() => setLoading(false));
  useEffect(() => { refresh(); }, []);

  const filteredClients = useMemo(() => {
    const query = search.trim().toLowerCase();
    const visibleByStatus = showArchived ? clients : clients.filter((client) => client.status !== 'inactive');
    if (!query) return visibleByStatus;
    return visibleByStatus.filter((client) =>
      [client.name, client.contact_name, client.email].some((value) => value?.toLowerCase().includes(query))
    );
  }, [clients, search, showArchived]);

  const save = async (payload) => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const isEdit = Boolean(payload.id);
      await upsertClient(payload);
      setShowForm(false);
      setEditing(null);
      setSuccess(isEdit ? 'Cliente aggiornato correttamente.' : 'Cliente creato correttamente.');
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (client) => {
    const confirmed = window.confirm(`Eliminare il cliente "${client.name}"? Questa azione non puo essere annullata.`);
    if (!confirmed) return;
    setError('');
    setSuccess('');
    try {
      await deleteClient(client.id);
      setSuccess('Cliente eliminato correttamente.');
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleArchive = async (client) => {
    const nextStatus = client.status === 'inactive' ? 'active' : 'inactive';
    const verb = nextStatus === 'inactive' ? 'archiviare' : 'riattivare';
    const confirmed = window.confirm(`Vuoi ${verb} il cliente "${client.name}"? I contenuti collegati resteranno invariati.`);
    if (!confirmed) return;
    setError('');
    setSuccess('');
    try {
      await updateClientStatus(client.id, nextStatus);
      setSuccess(nextStatus === 'inactive' ? 'Cliente archiviato correttamente.' : 'Cliente riattivato correttamente.');
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div>
      <PageTitle title="Clienti" description="Anagrafiche clienti, referenti e brand gestiti." action={<button className="btn-primary" onClick={() => { setEditing(null); setShowForm(true); }}><Plus className="h-4 w-4" />Nuovo cliente</button>} />
      <ErrorState message={error} />
      <SuccessState message={success} />
      <div className="surface mb-4 grid gap-3 p-4 md:grid-cols-[1fr_auto] md:items-center">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input className="form-input pl-9" placeholder="Cerca per nome, referente o email..." value={search} onChange={(event) => setSearch(event.target.value)} />
        </label>
        <label className="inline-flex items-center gap-2 text-sm font-bold text-slate-700">
          <input type="checkbox" className="h-4 w-4 rounded border-line" checked={showArchived} onChange={(event) => setShowArchived(event.target.checked)} />
          Mostra archiviati
        </label>
      </div>
      {showForm && <div className="mb-6"><ClientForm initialValue={editing} saving={saving} onSubmit={save} onCancel={() => { setShowForm(false); setEditing(null); }} /></div>}
      {filteredClients.length > 0 ? (
        <ClientsTable clients={filteredClients} onEdit={(client) => { setEditing(client); setShowForm(true); }} onDelete={remove} onArchiveToggle={toggleArchive} />
      ) : (
        <EmptyState title="Nessun cliente trovato" description={clients.length === 0 ? 'Crea il primo cliente per iniziare a collegare contenuti e calendario.' : showArchived ? 'Prova con un altro nome, referente o indirizzo email.' : 'Non ci sono clienti attivi con questi filtri. Attiva Mostra archiviati per vedere lo storico.'} />
      )}
    </div>
  );
}
