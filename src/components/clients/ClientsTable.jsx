import { Link } from 'react-router-dom';
import Badge from '../ui/Badge.jsx';
import { EmailLink, PhoneActions, WebsiteLink } from '../ui/ContactActions.jsx';
import { normalizeSocialLinks, primaryContact, websiteUrl } from '../../utils/contacts';

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'CL';
}

export default function ClientsTable({ clients, onEdit, onDelete, onArchiveToggle }) {
  return (
    <div className="surface overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Referente</th>
              <th className="px-4 py-3">Contatti</th>
              <th className="px-4 py-3">Sito</th>
              <th className="px-4 py-3">Brand/social</th>
              <th className="px-4 py-3">Stato</th>
              <th className="px-4 py-3 text-right">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {clients.map((client) => {
              const contact = primaryContact(client);
              const socialLinks = normalizeSocialLinks(client);
              return (
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
                <td className="px-4 py-4 font-medium">
                  {contact?.name || '-'}
                  {contact?.role && <p className="mt-1 text-xs text-muted">{contact.role}</p>}
                </td>
                <td className="px-4 py-4">
                  <div className="grid gap-2">
                    <EmailLink email={contact?.email} />
                    <PhoneActions phone={contact?.phone} />
                  </div>
                </td>
                <td className="px-4 py-4"><WebsiteLink website={client.website} /></td>
                <td className="px-4 py-4">
                  {socialLinks.length > 0 ? (
                    <div className="grid gap-1">
                      {socialLinks.slice(0, 3).map((item, index) => (
                        item.url ? (
                          <a key={index} className="font-semibold text-brand-700 hover:underline" href={websiteUrl(item.url)} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>
                            {item.brand || item.platform || item.url}
                          </a>
                        ) : (
                          <span key={index}>{item.brand || item.platform}</span>
                        )
                      ))}
                      {socialLinks.length > 3 && <span className="text-xs text-muted">+ altri {socialLinks.length - 3}</span>}
                    </div>
                  ) : client.managed_brands || '-'}
                </td>
                <td className="px-4 py-4"><Badge value={client.status} /></td>
                <td className="px-4 py-4 text-right">
                  <button className="text-sm font-bold text-brand-700 hover:underline" onClick={() => onArchiveToggle(client)}>
                    {client.status === 'inactive' ? 'Riattiva' : 'Archivia'}
                  </button>
                  <button className="ml-4 text-sm font-bold text-brand-700 hover:underline" onClick={() => onEdit(client)}>Modifica</button>
                  <button className="ml-4 text-sm font-bold text-rose-700 hover:underline" onClick={() => onDelete(client)}>Elimina</button>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
