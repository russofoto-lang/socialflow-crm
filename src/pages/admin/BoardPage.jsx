import { useEffect, useMemo, useRef, useState } from 'react';
import BoardColumn from '../../components/board/BoardColumn.jsx';
import ContentDetailModal from '../../components/contents/ContentDetailModal.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import PageTitle from '../../components/ui/PageTitle.jsx';
import SuccessState from '../../components/ui/SuccessState.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import useContentActions from '../../hooks/useContentActions';
import { listClients, listContents } from '../../lib/crmApi';
import { statusOptions } from '../../lib/options';

export default function BoardPage() {
  const { user } = useAuth();
  const [contents, setContents] = useState([]);
  const [clients, setClients] = useState([]);
  const [clientFilter, setClientFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const boardScrollRef = useRef(null);
  const scrollbarRef = useRef(null);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);

  const refresh = () => Promise.all([listContents(), listClients()])
    .then(([nextContents, nextClients]) => {
      setContents(nextContents);
      setClients(nextClients);
    })
    .catch((err) => setError(err.message))
    .finally(() => setLoading(false));

  useEffect(() => { refresh(); }, []);

  const contentActions = useContentActions({
    userId: user.id,
    refresh,
    messages: {
      saveEdit: 'Contenuto aggiornato.',
      delete: 'Contenuto eliminato.',
      duplicate: 'Contenuto duplicato in Idee.',
      status: 'Stato contenuto aggiornato.'
    }
  });

  const visibleContents = useMemo(
    () => clientFilter ? contents.filter((content) => content.client_id === clientFilter) : contents,
    [contents, clientFilter]
  );

  useEffect(() => {
    const updateScrollbarWidth = () => {
      const element = boardScrollRef.current;
      if (element) setScrollbarWidth(element.scrollWidth);
    };
    updateScrollbarWidth();
    window.addEventListener('resize', updateScrollbarWidth);
    return () => window.removeEventListener('resize', updateScrollbarWidth);
  }, [visibleContents]);

  const syncBoardScroll = (event) => {
    if (scrollbarRef.current) scrollbarRef.current.scrollLeft = event.currentTarget.scrollLeft;
  };

  const syncScrollbar = (event) => {
    if (boardScrollRef.current) boardScrollRef.current.scrollLeft = event.currentTarget.scrollLeft;
  };

  if (loading) return <LoadingState />;

  return (
    <div>
      <PageTitle title="Board" description="Centro operativo per seguire lo stato dei contenuti senza drag and drop." />
      <ErrorState message={error || contentActions.error} />
      <SuccessState message={contentActions.success} />
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
      <div ref={boardScrollRef} className="flex gap-4 overflow-x-auto pb-4" onScroll={syncBoardScroll}>
        {statusOptions.map((status) => (
          <BoardColumn
            key={status.value}
            title={status.label}
            status={status.value}
            contents={visibleContents.filter((content) => content.status === status.value)}
            onOpen={contentActions.openContentDetail}
            onStatusChange={contentActions.changeContentStatus}
          />
        ))}
      </div>
      <div ref={scrollbarRef} className="sticky bottom-0 z-20 mt-2 overflow-x-auto rounded-lg border border-line bg-white/95 p-1 shadow-soft backdrop-blur" onScroll={syncScrollbar}>
        <div style={{ width: `${scrollbarWidth}px`, height: 1 }} />
      </div>
      <ContentDetailModal
        content={contentActions.selectedContent}
        clients={clients}
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
