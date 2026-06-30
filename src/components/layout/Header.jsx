import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

const adminLinks = [
  ['/admin', 'Dashboard'],
  ['/admin/clienti', 'Clienti'],
  ['/admin/contenuti', 'Contenuti'],
  ['/admin/board', 'Board'],
  ['/admin/calendario', 'Calendario']
];

const clientLinks = [
  ['/cliente/approvazioni', 'Da approvare'],
  ['/cliente/calendario', 'Calendario'],
  ['/cliente/storico', 'Storico']
];

export default function Header({ variant }) {
  const { profile, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const links = variant === 'admin' ? adminLinks : clientLinks;

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to={variant === 'admin' ? '/admin' : '/cliente/approvazioni'} className="flex items-center gap-3 lg:hidden">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink text-xs font-black text-white">SF</span>
          <span className="font-black">SocialFlow CRM</span>
        </Link>
        <div className="hidden lg:block">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Workspace</p>
          <h1 className="text-lg font-bold">{profile?.full_name ?? 'Utente'}</h1>
        </div>
        <button className="btn-secondary px-3 lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Apri menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <div className="hidden items-center gap-3 lg:flex">
          <span className="rounded-md bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-600">
            {profile?.role === 'admin' ? 'Admin' : 'Cliente'}
          </span>
        </div>
      </div>
      {open && (
        <div className="border-t border-line bg-white px-4 py-3 shadow-sm lg:hidden">
          <div className="grid gap-1">
            {links.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-semibold ${isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-100'}`
                }
              >
                {label}
              </NavLink>
            ))}
            <button className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-100" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
