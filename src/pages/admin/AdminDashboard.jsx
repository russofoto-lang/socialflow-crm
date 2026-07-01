import { CalendarDays, KanbanSquare, Plus, WalletCards } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../../components/ui/Badge.jsx';
import ClientsToFollow from '../../components/dashboard/ClientsToFollow.jsx';
import ContentDetailModal from '../../components/contents/ContentDetailModal.jsx';
import ContentPreview from '../../components/contents/ContentPreview.jsx';
import DashboardStatCards from '../../components/dashboard/DashboardStatCards.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import PageTitle from '../../components/ui/PageTitle.jsx';
import PriorityToday from '../../components/dashboard/PriorityToday.jsx';
import UpcomingWeek from '../../components/dashboard/UpcomingWeek.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import useContentActions from '../../hooks/useContentActions';
import { listClients, listContents } from '../../lib/crmApi';
import { formatDate, toDateKey } from '../../utils/date';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [state, setState] = useState({ clients: [], contents: [], loading: true, error: '' });

  const refresh = () => (
    Promise.all([listClients(), listContents()])
      .then(([clients, contents]) => setState({ clients, contents, loading: false, error: '' }))
      .catch((err) => setState((current) => ({ ...current, loading: false, error: err.message })))
  );

  useEffect(() => { refresh(); }, []);

  const contentActions = useContentActions({ userId: user.id, refresh });

  const dashboardData = useMemo(() => {
    const today = toDateKey(new Date());
    const weekLimitDate = new Date();
    weekLimitDate.setDate(weekLimitDate.getDate() + 7);
    const weekLimit = toDateKey(weekLimitDate);
    const activeClients = state.clients.filter((client) => client.status !== 'inactive');
    const hasMedia = (content) => (content.content_files ?? []).length > 0;
    const isOpen = (content) => content.status !== 'published';
    const isInNextWeek = (content) => content.scheduled_date && content.scheduled_date >= today && content.scheduled_date <= weekLimit;

    const scheduledThisWeek = state.contents.filter(isInNextWeek);
    const futureClientIds = new Set(scheduledThisWeek.map((content) => content.client_id).filter(Boolean));
    const publishedByClient = state.contents
      .filter((content) => content.status === 'published' && content.client_id)
      .sort((a, b) => new Date(b.scheduled_date ?? b.created_at ?? 0) - new Date(a.scheduled_date ?? a.created_at ?? 0));

    const clientsToFollow = activeClients
      .filter((client) => !futureClientIds.has(client.id))
      .map((client) => ({
        ...client,
        lastPublished: publishedByClient.find((content) => content.client_id === client.id) || null
      }));

    return {
      comments: state.contents.flatMap((content) => (content.comments ?? []).map((comment) => ({ ...comment, contentTitle: content.title }))).slice(0, 5),
      scheduledThisWeek,
      toApproveCount: state.contents.filter((item) => item.status === 'to_approve').length,
      inProgressCount: state.contents.filter((item) => item.status === 'in_progress').length,
      activeClientsCount: activeClients.length,
      latestContents: [...state.contents].sort((a, b) => new Date(b.created_at ?? 0) - new Date(a.created_at ?? 0)).slice(0, 6),
      upcomingContents: [...scheduledThisWeek].sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date)),
      clientsToFollow,
      priorities: {
        overdue: state.contents
          .filter((content) => content.scheduled_date && content.scheduled_date < today && isOpen(content))
          .sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date)),
        today: state.contents
          .filter((content) => content.scheduled_date === today && isOpen(content))
          .sort((a, b) => new Date(a.created_at ?? 0) - new Date(b.created_at ?? 0)),
        approval: state.contents.filter((content) => content.status === 'to_approve'),
        missingCopy: state.contents.filter((content) => isOpen(content) && !content.copy_text?.trim()),
        missingMedia: state.contents.filter((content) => isOpen(content) && !hasMedia(content)),
        uncoveredClients: clientsToFollow
      }
    };
  }, [state.clients, state.contents]);

  if (state.loading) return <LoadingState />;

  return (
    <div>
      <PageTitle title="Dashboard Admin" description="Il pannello quotidiano per capire cosa richiede attenzione, cosa e in lavorazione e cosa sta per andare online." />
      <ErrorState message={state.error || contentActions.error} />
      <PriorityToday priorities={dashboardData.priorities} onOpenContent={contentActions.openContentDetail} />
      <section className="surface mb-6 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-brand-700">Azioni rapide</p>
            <h2 className="mt-1 text-xl font-black">Da qui parti per il lavoro di oggi</h2>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <Link className="btn-secondary" to="/admin/clienti"><Plus className="h-4 w-4" />Aggiungi cliente</Link>
            <Link className="btn-primary" to="/admin/contenuti"><WalletCards className="h-4 w-4" />Crea contenuto</Link>
            <Link className="btn-secondary" to="/admin/board"><KanbanSquare className="h-4 w-4" />Vai alla Board</Link>
            <Link className="btn-secondary" to="/admin/calendario"><CalendarDays className="h-4 w-4" />Vai al Calendario</Link>
          </div>
        </div>
      </section>
      <div className="mb-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <UpcomingWeek contents={dashboardData.upcomingContents} onOpenContent={contentActions.openContentDetail} />
        <ClientsToFollow clients={dashboardData.clientsToFollow} />
      </div>
      <DashboardStatCards
        toApproveCount={dashboardData.toApproveCount}
        inProgressCount={dashboardData.inProgressCount}
        scheduledWeekCount={dashboardData.scheduledThisWeek.length}
        activeClientsCount={dashboardData.activeClientsCount}
      />
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <section className="surface p-5 xl:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="section-title">Ultimi contenuti creati</h2>
            <Link className="text-sm font-bold text-brand-700 hover:underline" to="/admin/contenuti">Vedi tutti</Link>
          </div>
          <div className="grid gap-3">
            {dashboardData.latestContents.map((content) => (
              <button key={content.id} className="premium-card flex flex-col gap-3 p-3 text-left transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-soft sm:flex-row sm:items-center sm:justify-between" onClick={() => contentActions.openContentDetail(content)}>
                <div className="flex min-w-0 gap-3">
                  <ContentPreview content={content} compact />
                  <div className="min-w-0">
                    <p className="truncate font-bold">{content.title}</p>
                    <p className="mt-1 text-sm text-muted">{content.clients?.name} - {formatDate(content.scheduled_date)}</p>
                    {content.copy_text && <p className="mt-1 line-clamp-1 text-xs text-muted">{content.copy_text}</p>}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge type="platform" value={content.platform} />
                  <Badge type="contentType" value={content.content_type} />
                  <Badge value={content.status} />
                </div>
              </button>
            ))}
            {dashboardData.latestContents.length === 0 && <EmptyState title="Nessun contenuto" description="Crea il primo contenuto dalla sezione Contenuti." />}
          </div>
        </section>
        <section className="surface p-5">
          <h2 className="section-title mb-4">Ultimi commenti cliente</h2>
          <div className="grid gap-3">
            {dashboardData.comments.map((comment) => (
              <div key={comment.id} className="rounded-lg bg-slate-50 p-3 text-sm">
                <p className="font-bold">{comment.contentTitle}</p>
                <p className="mt-1 leading-5 text-muted">{comment.comment_text}</p>
              </div>
            ))}
            {dashboardData.comments.length === 0 && <EmptyState title="Nessun commento" description="I commenti dei clienti compariranno qui." />}
          </div>
        </section>
      </div>
      <ContentDetailModal
        content={contentActions.selectedContent}
        clients={state.clients}
        saving={contentActions.saving}
        userId={user.id}
        onClose={contentActions.closeContentDetail}
        onSubmit={contentActions.saveContent}
        onUpload={refresh}
        onDuplicate={contentActions.duplicateContent}
        onStatusChange={contentActions.changeContentStatus}
        onDelete={contentActions.deleteContent}
      />
    </div>
  );
}
