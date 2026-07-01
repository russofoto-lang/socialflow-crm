import { Archive, RotateCcw } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Badge from '../../components/ui/Badge.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import PageTitle from '../../components/ui/PageTitle.jsx';
import StatCard from '../../components/ui/StatCard.jsx';
import SuccessState from '../../components/ui/SuccessState.jsx';
import { listClients, listContents, updateClientStatus } from '../../lib/crmApi';
import { contentTypeOptions, labelFor, platformOptions, statusOptions } from '../../lib/options';
import { formatDate } from '../../utils/date';

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function contentDate(value) {
  return value ? new Date(`${value}T00:00:00`) : null;
}

function countByStatus(contents, status) {
  return contents.filter((content) => content.status === status).length;
}

export default function ClientDetailPage() {
  const { id } = useParams();
  const [state, setState] = useState({ client: null, contents: [], loading: true, error: '' });
  const [success, setSuccess] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);

  const refresh = () => {
    setState((current) => ({ ...current, loading: true, error: '' }));
    return Promise.all([listClients(), listContents({ client_id: id })])
      .then(([clients, contents]) => setState({ client: clients.find((item) => item.id === id), contents, loading: false, error: '' }))
      .catch((err) => setState((current) => ({ ...current, loading: false, error: err.message })));
  };

  useEffect(() => { refresh(); }, [id]);

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const limit = addDays(today, 7);
    const scheduledNext7Days = state.contents.filter((content) => {
      const date = contentDate(content.scheduled_date);
      return date && date >= today && date <= limit;
    }).length;

    return {
      total: state.contents.length,
      ideas: countByStatus(state.contents, 'ideas'),
      todo: countByStatus(state.contents, 'todo'),
      inProgress: countByStatus(state.contents, 'in_progress'),
      toApprove: countByStatus(state.contents, 'to_approve'),
      published: countByStatus(state.contents, 'published'),
      scheduledNext7Days
    };
  }, [state.contents]);

  const recentContents = useMemo(() => (
    [...state.contents]
      .sort((a, b) => new Date(b.created_at ?? b.scheduled_date ?? 0) - new Date(a.created_at ?? a.scheduled_date ?? 0))
      .slice(0, 8)
  ), [state.contents]);

  const toggleArchive = async () => {
    const nextStatus = state.client.status === 'inactive' ? 'active' : 'inactive';
    const verb = nextStatus === 'inactive' ? 'archiviare' : 'riattivare';
    const confirmed = window.confirm(`Vuoi ${verb} il cliente "${state.client.name}"? Lo storico e i contenuti collegati non verranno eliminati.`);
    if (!confirmed) return;
    setSavingStatus(true);
    setSuccess('');
    setState((current) => ({ ...current, error: '' }));
    try {
      const updated = await updateClientStatus(state.client.id, nextStatus);
      setState((current) => ({ ...current, client: updated }));
      setSuccess(nextStatus === 'inactive' ? 'Cliente archiviato correttamente.' : 'Cliente riattivato correttamente.');
    } catch (err) {
      setState((current) => ({ ...current, error: err.message }));
    } finally {
      setSavingStatus(false);
    }
  };

  if (state.loading) return <LoadingState />;
  if (!state.client) return <EmptyState title="Cliente non trovato" description="Il cliente richiesto non e disponibile." />;

  const isArchived = state.client.status === 'inactive';
  const brandVoice = state.client.brand_voice || state.client.brandVoice;

  return (
    <div>
      <PageTitle
        title={state.client.name}
        description="Scheda cliente, statistiche e contenuti collegati."
        action={
          <button className={isArchived ? 'btn-primary' : 'btn-secondary'} disabled={savingStatus} onClick={toggleArchive}>
            {isArchived ? <RotateCcw className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
            {savingStatus ? 'Aggiorno...' : isArchived ? 'Riattiva cliente' : 'Archivia cliente'}
          </button>
        }
      />
      <ErrorState message={state.error} />
      <SuccessState message={success} />

      <section className="grid gap-4 rounded-md border border-line bg-white p-5 shadow-sm md:grid-cols-2">
        <div><p className="text-sm text-muted">Referente</p><p className="font-semibold">{state.client.contact_name || '-'}</p></div>
        <div><p className="text-sm text-muted">Stato</p><Badge value={state.client.status} /></div>
        <div><p className="text-sm text-muted">Email</p><p className="font-semibold">{state.client.email || '-'}</p></div>
        <div><p className="text-sm text-muted">Telefono</p><p className="font-semibold">{state.client.phone || '-'}</p></div>
        <div className="md:col-span-2"><p className="text-sm text-muted">Brand/social gestiti</p><p className="font-semibold">{state.client.managed_brands || '-'}</p></div>
        {brandVoice && <div className="md:col-span-2"><p className="text-sm text-muted">Brand voice</p><p>{brandVoice}</p></div>}
        <div className="md:col-span-2"><p className="text-sm text-muted">Note interne</p><p>{state.client.notes || '-'}</p></div>
      </section>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Contenuti totali" value={stats.total} />
        <StatCard label="Idee" value={stats.ideas} tone="coral" />
        <StatCard label="Da fare" value={stats.todo} />
        <StatCard label="In lavorazione" value={stats.inProgress} tone="amber" />
        <StatCard label="Da approvare" value={stats.toApprove} tone="mint" />
        <StatCard label="Pubblicati" value={stats.published} />
        <StatCard label="Prossimi 7 giorni" value={stats.scheduledNext7Days} tone="coral" />
      </div>

      <section className="surface mt-6 p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="section-title">Contenuti recenti</h2>
          <Link className="text-sm font-bold text-brand-700 hover:underline" to={`/admin/contenuti?client_id=${state.client.id}`}>Vedi contenuti cliente</Link>
        </div>
        <div className="grid gap-3">
          {recentContents.map((content) => (
            <Link key={content.id} className="rounded-md border border-line p-3 transition hover:bg-slate-50" to={`/admin/contenuti?content=${content.id}`}>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="font-semibold">{content.title}</p>
                  <p className="mt-1 text-sm text-muted">Data prevista: {formatDate(content.scheduled_date)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge type="contentType" value={content.content_type} />
                  <Badge type="platform" value={content.platform} />
                  <Badge value={content.status} />
                </div>
              </div>
              <p className="mt-2 text-xs text-muted">
                {labelFor(contentTypeOptions, content.content_type) || content.content_type} su {labelFor(platformOptions, content.platform) || content.platform} - {labelFor(statusOptions, content.status) || content.status}
              </p>
            </Link>
          ))}
          {recentContents.length === 0 && <EmptyState title="Nessun contenuto collegato" description="Quando crei contenuti per questo cliente, compariranno qui." />}
        </div>
      </section>
    </div>
  );
}
