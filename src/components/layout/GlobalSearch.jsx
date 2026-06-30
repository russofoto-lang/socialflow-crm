import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listClients, listContents } from '../../lib/crmApi';
import { formatDate } from '../../utils/date';
import Badge from '../ui/Badge.jsx';

export default function GlobalSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([listClients(), listContents()])
      .then(([nextClients, nextContents]) => {
        setClients(nextClients);
        setContents(nextContents);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const results = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (value.length < 2) return { clients: [], contents: [] };

    return {
      clients: clients.filter((client) =>
        [client.name, client.contact_name, client.email].some((field) => field?.toLowerCase().includes(value))
      ).slice(0, 5),
      contents: contents.filter((content) =>
        [content.title, content.copy_text, content.internal_notes].some((field) => field?.toLowerCase().includes(value))
      ).slice(0, 6)
    };
  }, [clients, contents, query]);

  const hasQuery = query.trim().length >= 2;
  const hasResults = results.clients.length > 0 || results.contents.length > 0;

  const goToClient = (client) => {
    setOpen(false);
    setQuery('');
    navigate(`/admin/clienti/${client.id}`);
  };

  const goToContent = (content) => {
    setOpen(false);
    setQuery('');
    navigate(`/admin/contenuti?content=${content.id}`);
  };

  return (
    <div className="relative hidden w-full max-w-xl lg:block">
      <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
      <input
        className="form-input pl-9"
        placeholder="Cerca clienti, contenuti, copy o note..."
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
      />
      {open && hasQuery && (
        <div className="absolute left-0 right-0 top-12 z-40 max-h-[70vh] overflow-y-auto rounded-xl border border-line bg-white p-3 shadow-soft">
          {loading && <p className="px-3 py-2 text-sm text-muted">Carico risultati...</p>}
          {error && <p className="px-3 py-2 text-sm text-rose-700">{error}</p>}
          {!loading && !error && !hasResults && <p className="px-3 py-6 text-center text-sm text-muted">Nessun risultato trovato.</p>}
          {results.clients.length > 0 && (
            <section>
              <p className="px-3 py-2 text-xs font-black uppercase tracking-wide text-muted">Clienti</p>
              <div className="grid gap-1">
                {results.clients.map((client) => (
                  <button key={client.id} className="rounded-lg px-3 py-2 text-left transition hover:bg-brand-50" onClick={() => goToClient(client)}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-black">{client.name}</p>
                        <p className="text-xs text-muted">{client.contact_name || 'Referente non indicato'} - {client.email || 'Email non indicata'}</p>
                      </div>
                      <Badge value={client.status} />
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}
          {results.contents.length > 0 && (
            <section className="mt-3 border-t border-line pt-3">
              <p className="px-3 py-2 text-xs font-black uppercase tracking-wide text-muted">Contenuti</p>
              <div className="grid gap-1">
                {results.contents.map((content) => (
                  <button key={content.id} className="rounded-lg px-3 py-2 text-left transition hover:bg-brand-50" onClick={() => goToContent(content)}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-black">{content.title}</p>
                        <p className="text-xs text-muted">{content.clients?.name || 'Senza cliente'} - {formatDate(content.scheduled_date)}</p>
                      </div>
                      <div className="flex shrink-0 flex-wrap justify-end gap-1">
                        <Badge type="platform" value={content.platform} />
                        <Badge value={content.status} />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
