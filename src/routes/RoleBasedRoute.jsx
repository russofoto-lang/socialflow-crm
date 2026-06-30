import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import LoadingState from '../components/ui/LoadingState.jsx';

export default function RoleBasedRoute({ allowedRoles }) {
  const { profile, loading } = useAuth();

  if (loading || !profile) return <LoadingState label="Carico profilo..." fullScreen />;
  if (!allowedRoles.includes(profile.role)) {
    return <Navigate to={profile.role === 'admin' ? '/admin' : '/cliente/approvazioni'} replace />;
  }

  return <Outlet />;
}
