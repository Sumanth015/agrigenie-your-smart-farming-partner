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
  // If no user was cached locally, don't block the UI with a full-page spinner
  const [loading, setLoading] = useState<boolean>(() => !!getStoredLocalUser());

  useEffect(() => {
    let isMounted = true;

    const handleLocalAuthChange = () => {
      const local = getStoredLocalUser();
      if (!session?.user && isMounted) {
        setUser(local);
      }
    };

    window.addEventListener('agrigenie_auth_change', handleLocalAuthChange);
    window.addEventListener('storage', handleLocalAuthChange);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (!isMounted) return;
      setSession(currentSession);
      if (currentSession?.user) {
        setUser(currentSession.user);
      } else {
        setUser(getStoredLocalUser());
      }
      setLoading(false);
    });

    // Timeout guard so remote session check never hangs the app
    const sessionTimeout = new Promise((resolve) => setTimeout(resolve, 800));
    Promise.race([supabase.auth.getSession(), sessionTimeout])
      .then((res: any) => {
        if (!isMounted) return;
        const existingSession = res?.data?.session;
        if (existingSession) {
          setSession(existingSession);
          setUser(existingSession.user);
        } else {
          setUser(getStoredLocalUser());
        }
        setLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setUser(getStoredLocalUser());
        setLoading(false);
      });

    return () => {
      isMounted = false;
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

