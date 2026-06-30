import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Sidebar from './Sidebar.jsx';

export default function AppLayout({ variant }) {
  return (
    <div className="min-h-screen text-ink">
      <Sidebar variant={variant} />
      <div className="min-h-screen lg:pl-72">
        <Header variant={variant} />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
