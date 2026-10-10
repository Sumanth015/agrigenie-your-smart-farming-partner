import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export const AUTH_LOCAL_STORAGE_KEY = 'agrigenie_user';
export const AUTH_PROFILE_KEY = 'agrigenie_profile';

export const getStoredLocalUser = (): User | null => {
  try {
    const raw = localStorage.getItem(AUTH_LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setLocalAuthUser = (user: User | null) => {
  try {
    if (user) {
      localStorage.setItem(AUTH_LOCAL_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY);
    }
  } catch {}
  window.dispatchEvent(new CustomEvent('agrigenie_auth_change', { detail: user }));
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => getStoredLocalUser());
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLocalAuthChange = () => {
      const local = getStoredLocalUser();
      if (!session?.user) {
        setUser(local);
      }
    };

    window.addEventListener('agrigenie_auth_change', handleLocalAuthChange);
    window.addEventListener('storage', handleLocalAuthChange);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      if (currentSession?.user) {
        setUser(currentSession.user);
      } else {
        setUser(getStoredLocalUser());
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      setSession(existingSession);
      if (existingSession?.user) {
        setUser(existingSession.user);
      } else {
        setUser(getStoredLocalUser());
      }
      setLoading(false);
    }).catch(() => {
      setUser(getStoredLocalUser());
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('agrigenie_auth_change', handleLocalAuthChange);
      window.removeEventListener('storage', handleLocalAuthChange);
    };
  }, [session?.user]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase signOut error:', e);
    }
    setLocalAuthUser(null);
    try {
      localStorage.removeItem(AUTH_PROFILE_KEY);
    } catch {}
    setUser(null);
    setSession(null);
  };

  return { user, session, loading, signOut };
}

