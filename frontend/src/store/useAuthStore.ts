import { useContext } from 'react';
import { AuthContext, type AuthContextType } from './AuthContext';

export const useAuthStore = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthStore must be used within AuthProvider');
  }
  return context;
};
