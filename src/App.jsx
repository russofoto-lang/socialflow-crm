import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import RoleBasedRoute from './routes/RoleBasedRoute.jsx';
import AppLayout from './components/layout/AppLayout.jsx';

const LoginPage = lazy(() => import('./pages/auth/LoginPage.jsx'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'));
const ClientsPage = lazy(() => import('./pages/admin/ClientsPage.jsx'));
const ClientDetailPage = lazy(() => import('./pages/admin/ClientDetailPage.jsx'));
const ContentsPage = lazy(() => import('./pages/admin/ContentsPage.jsx'));
const BoardPage = lazy(() => import('./pages/admin/BoardPage.jsx'));
const CalendarPage = lazy(() => import('./pages/admin/CalendarPage.jsx'));
const ClientApprovalPage = lazy(() => import('./pages/client/ClientApprovalPage.jsx'));
const ClientCalendarPage = lazy(() => import('./pages/client/ClientCalendarPage.jsx'));
const ClientHistoryPage = lazy(() => import('./pages/client/ClientHistoryPage.jsx'));

function PageFallback() {
  return <div className="p-6 text-sm font-semibold text-muted">Caricamento pagina...</div>;
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleBasedRoute allowedRoles={['admin']} />}>
            <Route element={<AppLayout variant="admin" />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/clienti" element={<ClientsPage />} />
              <Route path="/admin/clienti/:id" element={<ClientDetailPage />} />
              <Route path="/admin/contenuti" element={<ContentsPage />} />
              <Route path="/admin/board" element={<BoardPage />} />
              <Route path="/admin/calendario" element={<CalendarPage />} />
            </Route>
          </Route>
          <Route element={<RoleBasedRoute allowedRoles={['client']} />}>
            <Route element={<AppLayout variant="client" />}>
              <Route path="/cliente/approvazioni" element={<ClientApprovalPage />} />
              <Route path="/cliente/calendario" element={<ClientCalendarPage />} />
              <Route path="/cliente/storico" element={<ClientHistoryPage />} />
            </Route>
          </Route>
        </Route>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}
