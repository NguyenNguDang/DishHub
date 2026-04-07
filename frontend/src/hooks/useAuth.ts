import { useState, useCallback } from 'react';

interface UseAuthReturn {
  isLoggedIn: boolean;
  user: { id: string; email: string; username: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string; username: string } | null>(null);

  const login = useCallback(async (email: string, _password: string) => {
    try {
      // TODO: Call API endpoint
      setIsLoggedIn(true);
      setUser({ id: '1', email, username: 'User' });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUser(null);
  }, []);

  return { isLoggedIn, user, login, logout };
};
