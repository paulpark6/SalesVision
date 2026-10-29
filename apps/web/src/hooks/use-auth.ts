
'use client';

import { useState, useEffect, useCallback } from 'react';

const AUTH_KEY = 'salesvision_auth';

type AuthState = {
  role: 'admin' | 'employee' | 'manager';
  name: string;
  userId: string;
  organizationId?: string;
  employeeId?: number;
} | null;

// undefined means we haven't checked localStorage yet
// null means the user is not logged in
type AuthLoadingState = AuthState | undefined;


import { apiClient } from '@/lib/api-client';
import { supabase } from '@/lib/supabase';

const LEFT_AT_KEY = 'salesvision_left_at';
// ponytail: only checked on page load; add a visibilitychange check if returning to an open tab should log out too
const SESSION_TTL_MS = 30 * 60 * 1000;

// Runs once per page load: if the user left the app more than SESSION_TTL_MS ago, end the session.
// Skipped on /update-password so the reset-email link's session survives.
const sessionCheck: Promise<void> = typeof window === 'undefined' ? Promise.resolve() : (async () => {
  const leftAt = Number(localStorage.getItem(LEFT_AT_KEY));
  localStorage.removeItem(LEFT_AT_KEY);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') localStorage.setItem(LEFT_AT_KEY, String(Date.now()));
  });
  if (leftAt && Date.now() - leftAt > SESSION_TTL_MS && window.location.pathname !== '/update-password') {
    localStorage.removeItem(AUTH_KEY);
    await supabase?.auth.signOut();
  }
})();

export function useAuth() {
  const [auth, setAuth] = useState<AuthLoadingState>(undefined);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      await sessionCheck;
      // Check for stored auth first
      let storedAuth = localStorage.getItem(AUTH_KEY);

      // In production, we always try to fetch from API (Supabase session).
      // In development, we ONLY fetch if we have a stored choice, 
      // otherwise we redirect to /login to allow role selection.
      if (!storedAuth && process.env.NODE_ENV === 'development') {
        setAuth(null);
        return;
      }

      const user = await apiClient<{ role: 'admin' | 'manager' | 'staff' | 'employee'; email: string; organization_id: string; employee_id: number }>('/users/me');
      if (user) {
        const authData: AuthState = {
          role: user.role === 'staff' ? 'employee' : user.role as 'admin' | 'manager',
          name: user.email,
          userId: user.email,
          organizationId: user.organization_id,
          employeeId: user.employee_id
        };
        setAuth(authData);
        localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
      }
    } catch (err) {
      console.error("Failed to fetch user session", err);
      // Signed in to Supabase but not on the allowed list (or deactivated): end the session
      const { data } = (await supabase?.auth.getSession()) ?? {};
      if (data?.session) {
        setError(err instanceof Error ? err.message : 'Access denied');
        await supabase!.auth.signOut();
      }
      localStorage.removeItem(AUTH_KEY);
      setAuth(null);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = useCallback((role: 'director' | 'staff' | 'manager') => {
    // For DEV testing: Save a mock identity to localStorage.
    // The apiClient will no longer inject this into headers automatically (we removed that),
    // but the backend handles the dev-mode fallback.
    // However, we save it here so the UI can "remember" who you chose to be.

    let name = 'Admin User';
    let finalRole: 'admin' | 'employee' | 'manager' = 'admin';
    let userId = 'admin@salesvision.com';

    if (role === 'manager') {
      name = 'Alex Ray';
      finalRole = 'manager';
      userId = 'manager@salesvision.com';
    } else if (role === 'staff') {
      name = 'Jane Smith';
      finalRole = 'employee';
      userId = 'staff@salesvision.com';
    }

    const authData: AuthState = { role: finalRole, name, userId };
    localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
    // No full-page reload here: it would count as leaving and end the session. The login page does router.push('/sales').
  }, []);


  const loginWithPassword = useCallback(async (email: string, password: string) => {
    setError(null);
    if (!supabase) {
      setError('Login is not configured');
      return;
    }
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError('Wrong email or password');
      return;
    }
    await fetchUser();
  }, [fetchUser]);

  const logout = useCallback(async () => {
    localStorage.removeItem(AUTH_KEY);
    await supabase?.auth.signOut();
    setAuth(null);
  }, []);

  return { auth, error, login, loginWithPassword, logout };
}
