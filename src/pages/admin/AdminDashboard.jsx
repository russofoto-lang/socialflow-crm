import { CalendarDays, CheckCircle2, Clock3, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../../components/ui/Badge.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import PageTitle from '../../components/ui/PageTitle.jsx';
import StatCard from '../../components/ui/StatCard.jsx';
import { listClients, listContents } from '../../lib/crmApi';
import { formatDate } from '../../utils/date';

export default function AdminDashboard() {
  const [state, setState] = useState({ clients: [], contents: [], loading: true, error: '' });

  useEffect(() => {
    Promise.all([listClients(), listContents()])
      .then(([clients, contents]) => setState({ clients, contents, loading: false, error: '' }))
      .catch((err) => setState((current) => ({ ...current, loading: false, error: err.message })));
  }, []);

  if (state.loading) return <LoadingState />;

  const comments = state.contents.flatMap((content) => (content.comments ?? []).map((comment) => ({ ...comment, contentTitle: content.title }))).slice(0, 5);
  const weekLimit = new Date();
  weekLimit.setDate(weekLimit.getDate() + 7);
  const scheduledThisWeek = state.contents.filter((content) => content.scheduled_date && new Date(content.scheduled_date) <= weekLimit);
  const latestContents = [...state.contents].sort((a, b) => new Date(b.created_at ?? 0) - new Date(a.created_at ?? 0)).slice(0, 6);
  const upcomingContents = [...scheduledThisWeek].sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date)).slice(0, 6);

  return (
    <div>
      <PageTitle title="Dashboard Admin" description="Riepilogo operativo dei contenuti, clienti e approvazioni." />
      <ErrorState message={state.error} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard to="/admin/contenuti" icon={CheckCircle2} label="Contenuti da approvare" value={state.contents.filter((item) => item.status === 'to_approve').length} tone="amber" />
        <StatCard to="/admin/board" icon={Clock3} label="In lavorazione" value={state.contents.filter((item) => item.status === 'in_progress').length} />
        <StatCard to="/admin/calendario" icon={CalendarDays} label="Programmato questa settimana" value={scheduledThisWeek.length} tone="mint" />
        <StatCard to="/admin/clienti" icon={Users} label="Clienti attivi" value={state.clients.filter((client) => client.status === 'active').length} tone="coral" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <section className="surface p-5 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="section-title">Ultimi contenuti creati</h2>
            <Link className="text-sm font-bold text-brand-700 hover:underline" to="/admin/contenuti">Vedi tutti</Link>
          </div>
          <div className="grid gap-3">
            {latestContents.map((content) => (
              <div key={content.id} className="flex flex-col gap-3 rounded-lg border border-line bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-bold">{content.title}</p>
                  <p className="mt-1 text-sm text-muted">{content.clients?.name} - {formatDate(content.scheduled_date)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge type="contentType" value={content.content_type} />
                  <Badge value={content.status} />
                </div>
              </div>
            ))}
            {latestContents.length === 0 && <EmptyState title="Nessun contenuto" description="Crea il primo contenuto dalla sezione Contenuti." />}
          </div>
        </section>
        <section className="surface p-5">
          <h2 className="section-title mb-4">Ultimi commenti cliente</h2>
          <div className="grid gap-3">
            {comments.map((comment) => (
              <div key={comment.id} className="rounded-lg bg-slate-50 p-3 text-sm">
                <p className="font-bold">{comment.contentTitle}</p>
                <p className="mt-1 leading-5 text-muted">{comment.comment_text}</p>
              </div>
            ))}
            {comments.length === 0 && <EmptyState title="Nessun commento" description="I commenti dei clienti compariranno qui." />}
          </div>
        </section>
      </div>
      <section className="surface mt-6 p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="section-title">Prossimi contenuti in calendario</h2>
          <Link className="text-sm font-bold text-brand-700 hover:underline" to="/admin/calendario">Apri calendario</Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {upcomingContents.map((content) => (
            <div key={content.id} className="rounded-lg border border-line p-4">
              <p className="font-bold">{content.title}</p>
              <p className="mt-1 text-sm text-muted">{content.clients?.name} - {formatDate(content.scheduled_date)}</p>
              <div className="mt-3"><Badge value={content.status} /></div>
            </div>
          ))}
        </div>
        {upcomingContents.length === 0 && <EmptyState title="Nessun contenuto programmato" description="I contenuti con data prevista nei prossimi giorni compariranno qui." />}
      </section>
    </div>
  );
}
