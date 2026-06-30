import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import ClientsPage from './pages/admin/ClientsPage.jsx';
import ClientDetailPage from './pages/admin/ClientDetailPage.jsx';
import ContentsPage from './pages/admin/ContentsPage.jsx';
import BoardPage from './pages/admin/BoardPage.jsx';
import CalendarPage from './pages/admin/CalendarPage.jsx';
import ClientApprovalPage from './pages/client/ClientApprovalPage.jsx';
import ClientCalendarPage from './pages/client/ClientCalendarPage.jsx';
import ClientHistoryPage from './pages/client/ClientHistoryPage.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import RoleBasedRoute from './routes/RoleBasedRoute.jsx';
import AppLayout from './components/layout/AppLayout.jsx';

export default function App() {
  return (
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
  );
}
