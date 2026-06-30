import { useEffect, useMemo, useState } from 'react';
import BoardColumn from '../../components/board/BoardColumn.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import PageTitle from '../../components/ui/PageTitle.jsx';
import SuccessState from '../../components/ui/SuccessState.jsx';
import { listClients, listContents, updateContentStatus } from '../../lib/crmApi';
import { statusOptions } from '../../lib/options';

export default function BoardPage() {
  const [contents, setContents] = useState([]);
  const [clients, setClients] = useState([]);
  const [clientFilter, setClientFilter] = useState('');
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
            onStatusChange={async (id, value) => {
              setError('');
              setSuccess('');
              try {
                await updateContentStatus(id, value);
                setSuccess('Stato contenuto aggiornato.');
                await refresh();
              } catch (err) {
                setError(err.message);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}
