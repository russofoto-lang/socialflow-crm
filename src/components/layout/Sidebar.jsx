import { CalendarDays, KanbanSquare, LayoutDashboard, LogOut, MessageSquareText, Users, WalletCards } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/clienti', label: 'Clienti', icon: Users },
  { to: '/admin/contenuti', label: 'Contenuti', icon: WalletCards },
  { to: '/admin/board', label: 'Board', icon: KanbanSquare },
  { to: '/admin/calendario', label: 'Calendario', icon: CalendarDays }
];

const clientLinks = [
  { to: '/cliente/approvazioni', label: 'Da approvare', icon: MessageSquareText },
  { to: '/cliente/calendario', label: 'Calendario', icon: CalendarDays },
  { to: '/cliente/storico', label: 'Storico contenuti', icon: WalletCards }
];

export default function Sidebar({ variant }) {
  const { profile, logout } = useAuth();
  const links = variant === 'admin' ? adminLinks : clientLinks;

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-line bg-white/95 lg:flex lg:flex-col">
      <div className="px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-ink text-sm font-black text-white shadow-sm">SF</div>
          <div>
            <p className="text-base font-black">SocialFlow CRM</p>
            <p className="text-xs font-medium text-muted">{variant === 'admin' ? 'Area agenzia' : 'Area cliente'}</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-4">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/admin'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                isActive ? 'bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-100' : 'text-slate-700 hover:bg-slate-100'
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-line p-4">
        <div className="mb-3 rounded-lg bg-slate-50 px-3 py-2">
          <p className="truncate text-sm font-semibold">{profile?.full_name ?? 'Utente'}</p>
          <p className="text-xs font-medium uppercase text-muted">{profile?.role === 'admin' ? 'Admin' : 'Cliente'}</p>
        </div>
        <button className="btn-secondary w-full" onClick={logout}>
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
