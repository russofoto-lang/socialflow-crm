import { useEffect, useState } from 'react';
import Badge from '../../components/ui/Badge.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import PageTitle from '../../components/ui/PageTitle.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { listContents } from '../../lib/crmApi';
import { formatDate } from '../../utils/date';

export default function ClientHistoryPage() {
  const { profile } = useAuth();
  const [state, setState] = useState({ contents: [], loading: true, error: '' });
  useEffect(() => {
    listContents({ client_id: profile.client_id })
      .then((contents) => setState({ contents, loading: false, error: '' }))
      .catch((err) => setState({ contents: [], loading: false, error: err.message }));
  }, [profile.client_id]);

  if (state.loading) return <LoadingState />;
  const history = state.contents.filter((content) => ['approved', 'changes_requested'].includes(content.approval_status) || content.status === 'published');

  return (
    <div>
      <PageTitle title="Storico contenuti" description="Contenuti approvati, pubblicati o già revisionati." />
      <ErrorState message={state.error} />
      <div className="grid gap-3">
        {history.map((content) => (
          <article key={content.id} className="rounded-md border border-line bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div><h2 className="font-bold">{content.title}</h2><p className="text-sm text-muted">{formatDate(content.scheduled_date)}</p></div>
              <div className="flex flex-wrap gap-2"><Badge value={content.status} /><Badge type="approval" value={content.approval_status} /></div>
            </div>
          </article>
        ))}
        {history.length === 0 && <EmptyState title="Storico vuoto" description="I contenuti approvati o pubblicati compariranno qui." />}
      </div>
    </div>
  );
}
