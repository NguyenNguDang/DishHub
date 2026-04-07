import { useState, useCallback, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import { authService } from '../services';
import { AuthContext, type AuthContextType } from './AuthContext';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Restore user từ localStorage khi app khởi động
  useEffect(() => {
    const restoreUserFromStorage = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          // Lấy thông tin user hiện tại từ backend
          const userData = await authService.getCurrentUser();
          setUser(userData);
        }
      } catch (err) {
        console.error('Error restoring user:', err);
        // Nếu lỗi, xóa token (có thể đã hết hạn)
        localStorage.removeItem('accessToken');
      } finally {
        setIsLoading(false);
      }
    };

    restoreUserFromStorage();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { user: userData, token } = await authService.login(email, password);
       
       // Lưu token vào localStorage
       localStorage.setItem('accessToken', token);
       
       // Lưu user thông tin
       setUser(userData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(errorMessage);
      console.error('Login error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const { user: userData, token } = await authService.register(email, password, firstName, lastName);
        
        // Lưu token vào localStorage
        localStorage.setItem('accessToken', token);
        
        // Lưu user thông tin
        setUser(userData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Registration failed. Please try again.';
        setError(errorMessage);
        console.error('Registration error:', err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('accessToken');
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    isLoggedIn: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    setUser,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

