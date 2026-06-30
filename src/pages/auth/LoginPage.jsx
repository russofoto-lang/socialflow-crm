import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import ErrorState from '../../components/ui/ErrorState.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function LoginPage() {
  const { login, session, profile, loading, error, isSupabaseConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  if (loading) return <LoadingState fullScreen />;
  if (session && profile) return <Navigate to={profile.role === 'admin' ? '/admin' : '/cliente/approvazioni'} replace />;

  const submit = async (event) => {
    event.preventDefault();
    await login(email, password);
    navigate('/login');
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-md rounded-md border border-line bg-white p-6 shadow-soft">
        <div className="mb-6">
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-md bg-ink font-black text-white">SF</div>
          <h1 className="text-2xl font-bold">SocialFlow CRM</h1>
          <p className="mt-1 text-sm text-muted">Accedi alla dashboard agenzia o all'area approvazione cliente.</p>
        </div>
        {!isSupabaseConfigured && (
          <ErrorState message="Configura VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY nel file .env prima di usare il login." />
        )}
        <form className="mt-5 grid gap-4" onSubmit={submit}>
          <label className="text-sm font-medium">Email<input className="form-input mt-1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
          <label className="text-sm font-medium">Password<input className="form-input mt-1" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
          <button className="btn-primary" disabled={!isSupabaseConfigured}>
            Accedi
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
        <ErrorState message={error} />
      </section>
    </main>
  );
}
