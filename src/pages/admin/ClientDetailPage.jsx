import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Badge from '../../components/ui/Badge.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import PageTitle from '../../components/ui/PageTitle.jsx';
import { listClients, listContents } from '../../lib/crmApi';
import { formatDate } from '../../utils/date';

export default function ClientDetailPage() {
  const { id } = useParams();
  const [state, setState] = useState({ client: null, contents: [], loading: true, error: '' });

  useEffect(() => {
    Promise.all([listClients(), listContents({ client_id: id })])
      .then(([clients, contents]) => setState({ client: clients.find((item) => item.id === id), contents, loading: false, error: '' }))
      .catch((err) => setState((current) => ({ ...current, loading: false, error: err.message })));
  }, [id]);

  if (state.loading) return <LoadingState />;
  if (!state.client) return <EmptyState title="Cliente non trovato" description="Il cliente richiesto non è disponibile." />;

  const comments = state.contents.flatMap((content) => (content.comments ?? []).map((comment) => ({ ...comment, contentTitle: content.title }))).slice(0, 6);

  return (
    <div>
      <PageTitle title={state.client.name} description="Dettaglio cliente, contenuti collegati e commenti recenti." />
      <ErrorState message={state.error} />
      <section className="grid gap-4 rounded-md border border-line bg-white p-5 shadow-sm md:grid-cols-2">
        <div><p className="text-sm text-muted">Referente</p><p className="font-semibold">{state.client.contact_name}</p></div>
        <div><p className="text-sm text-muted">Stato</p><Badge value={state.client.status} /></div>
        <div><p className="text-sm text-muted">Email</p><p className="font-semibold">{state.client.email}</p></div>
        <div><p className="text-sm text-muted">Telefono</p><p className="font-semibold">{state.client.phone}</p></div>
        <div className="md:col-span-2"><p className="text-sm text-muted">Brand/social</p><p className="font-semibold">{state.client.managed_brands}</p></div>
        <div className="md:col-span-2"><p className="text-sm text-muted">Note</p><p>{state.client.notes}</p></div>
      </section>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="rounded-md border border-line bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-bold">Contenuti collegati</h2>
          <div className="grid gap-3">
            {state.contents.map((content) => <div key={content.id} className="rounded-md border border-line p-3"><p className="font-semibold">{content.title}</p><p className="text-sm text-muted">{formatDate(content.scheduled_date)}</p><Badge value={content.status} /></div>)}
          </div>
        </section>
        <section className="rounded-md border border-line bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-bold">Commenti recenti</h2>
          <div className="grid gap-3">
            {comments.map((comment) => <div key={comment.id} className="rounded-md bg-slate-50 p-3 text-sm"><p className="font-semibold">{comment.contentTitle}</p><p className="mt-1 text-muted">{comment.comment_text}</p></div>)}
            {comments.length === 0 && <p className="text-sm text-muted">Nessun commento recente.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
