import { Link } from 'react-router-dom';
import Badge from '../ui/Badge.jsx';

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'CL';
}

export default function ClientsTable({ clients, onEdit, onDelete }) {
  return (
    <div className="surface overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[780px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Referente</th>
              <th className="px-4 py-3">Contatti</th>
              <th className="px-4 py-3">Brand/social</th>
              <th className="px-4 py-3">Stato</th>
              <th className="px-4 py-3 text-right">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {clients.map((client) => (
              <tr key={client.id} className="align-top transition hover:bg-slate-50">
                <td className="px-4 py-4">
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-50 text-sm font-black text-brand-700 ring-1 ring-brand-100">
                      {initials(client.name)}
                    </div>
                    <div className="min-w-0">
                      <Link className="font-bold text-brand-700 hover:underline" to={`/admin/clienti/${client.id}`}>{client.name}</Link>
                      {client.notes && <p className="mt-1 line-clamp-1 text-xs text-muted">{client.notes}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 font-medium">{client.contact_name || '-'}</td>
                <td className="px-4 py-4 text-muted">{client.email || '-'}<br />{client.phone || '-'}</td>
                <td className="px-4 py-4">{client.managed_brands || '-'}</td>
                <td className="px-4 py-4"><Badge value={client.status} /></td>
                <td className="px-4 py-4 text-right">
                  <button className="text-sm font-bold text-brand-700 hover:underline" onClick={() => onEdit(client)}>Modifica</button>
                  <button className="ml-4 text-sm font-bold text-rose-700 hover:underline" onClick={() => onDelete(client)}>Elimina</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
