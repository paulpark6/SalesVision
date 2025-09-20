
'use client';

import { useState, useEffect, useCallback } from 'react';

const AUTH_KEY = 'salesvision_auth';

type AuthState = {
  role: 'admin' | 'employee' | 'manager';
  name: string;
} | null;

// undefined means we haven't checked localStorage yet
// null means the user is not logged in
type AuthLoadingState = AuthState | undefined;


export function useAuth() {
  const [auth, setAuth] = useState<AuthLoadingState>(undefined);

  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem(AUTH_KEY);
      if (storedAuth) {
        setAuth(JSON.parse(storedAuth));
      } else {
        setAuth(null);
      }
    } catch (error) {
      console.error("Failed to parse auth from localStorage", error);
      setAuth(null);
    }
  }, []);

  const login = useCallback((role: 'admin' | 'employee' | 'manager') => {
    let name = 'Admin User';
    if (role === 'manager') name = 'Alex Ray';
    if (role === 'employee') name = 'Jane Smith';
    
    const newAuth = { role, name };
    localStorage.setItem(AUTH_KEY, JSON.stringify(newAuth));
    setAuth(newAuth);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setAuth(null);
  }, []);

  return { auth, login, logout };
}
