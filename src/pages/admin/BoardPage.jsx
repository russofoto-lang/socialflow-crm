import { useEffect, useState } from 'react';
import BoardColumn from '../../components/board/BoardColumn.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import PageTitle from '../../components/ui/PageTitle.jsx';
import SuccessState from '../../components/ui/SuccessState.jsx';
import { listContents, updateContentStatus } from '../../lib/crmApi';
import { statusOptions } from '../../lib/options';

export default function BoardPage() {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const refresh = () => listContents().then(setContents).catch((err) => setError(err.message)).finally(() => setLoading(false));
  useEffect(() => { refresh(); }, []);

  if (loading) return <LoadingState />;

  return (
    <div>
      <PageTitle title="Board" description="Vista operativa per spostare i contenuti tra gli stati senza drag and drop." />
      <ErrorState message={error} />
      <SuccessState message={success} />
      <div className="flex gap-4 overflow-x-auto pb-4">
        {statusOptions.map((status) => (
          <BoardColumn
            key={status.value}
            title={status.label}
            contents={contents.filter((content) => content.status === status.value)}
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
