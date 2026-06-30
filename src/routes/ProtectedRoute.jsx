import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import LoadingState from '../components/ui/LoadingState.jsx';

export default function ProtectedRoute() {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingState label="Controllo sessione..." fullScreen />;
  if (!session) return <Navigate to="/login" replace state={{ from: location }} />;

  return <Outlet />;
}
