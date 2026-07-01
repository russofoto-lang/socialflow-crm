import { Link } from 'react-router-dom';
import EmptyState from '../ui/EmptyState.jsx';
import { formatDate } from '../../utils/date';

export default function ClientsToFollow({ clients }) {
  return (
    <section className="surface p-5">
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-wide text-brand-700">Clienti da seguire</p>
        <h2 className="section-title">Copertura editoriale</h2>
      </div>
      <div className="grid gap-3">
        {clients.map((client) => (
          <div key={client.id} className="rounded-xl border border-line bg-white p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-black">{client.name}</p>
                <p className="mt-1 text-xs text-muted">
                  {client.lastPublished
                    ? `Ultimo contenuto pubblicato: ${formatDate(client.lastPublished.scheduled_date)}`
                    : 'Nessun contenuto programmato nei prossimi 7 giorni'}
                </p>
              </div>
              <Link className="shrink-0 text-xs font-bold text-brand-700 hover:underline" to={`/admin/clienti/${client.id}`}>Apri cliente</Link>
            </div>
          </div>
        ))}
        {clients.length === 0 && <EmptyState title="Tutti i clienti attivi hanno contenuti programmati." description="La copertura dei prossimi 7 giorni e' completa." />}
      </div>
    </section>
  );
}
