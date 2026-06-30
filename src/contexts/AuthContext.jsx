import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getProfile } from '../lib/crmApi';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return undefined;
    }

    const load = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      if (data.session?.user) {
        try {
          setProfile(await getProfile(data.session.user.id));
        } catch (err) {
          setError(err.message);
        }
      }
      setLoading(false);
    };

    load();
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      setError('');
      if (nextSession?.user) {
        try {
          setProfile(await getProfile(nextSession.user.id));
        } catch (err) {
          setProfile(null);
          setError(err.message);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError('');
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    if (loginError) {
      setLoading(false);
      setError(loginError.message);
      throw loginError;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  };

  const value = useMemo(
    () => ({ session, user: session?.user ?? null, profile, loading, error, login, logout, isSupabaseConfigured }),
    [session, profile, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
