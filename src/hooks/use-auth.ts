
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

  const login = useCallback((role: 'admin-john' | 'admin-user' | 'employee' | 'manager') => {
    let name = 'Admin User';
    let finalRole: 'admin' | 'employee' | 'manager' = 'admin';

    if (role === 'manager') {
      name = 'Alex Ray';
      finalRole = 'manager';
    } else if (role === 'employee') {
      name = 'Jane Smith';
      finalRole = 'employee';
    } else if (role === 'admin-john') {
        name = 'John Doe';
        finalRole = 'admin';
    } else if (role === 'admin-user') {
        name = 'Admin User';
        finalRole = 'admin';
    }
    
    const newAuth = { role: finalRole, name };
    localStorage.setItem(AUTH_KEY, JSON.stringify(newAuth));
    setAuth(newAuth);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setAuth(null);
  }, []);

  return { auth, login, logout };
}
