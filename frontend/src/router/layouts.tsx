import { Outlet } from 'react-router-dom';
import { MainLayout } from '../components';
import { AuthProvider } from '../store';
import { useAuthStore } from '../store';

/**
 * Root layout component - Layout chính cho toàn ứng dụng
 */
export const RootLayout = () => {
  const { isLoggedIn, user, logout } = useAuthStore();

  return (
    <MainLayout
      isLoggedIn={isLoggedIn}
      userName={user?.username}
      onLogout={logout}
    >
      <Outlet />
    </MainLayout>
  );
};

/**
 * Wrap RootLayout với AuthProvider
 */
export const RootLayoutWithAuth = () => {
  return (
    <AuthProvider>
      <RootLayout />
    </AuthProvider>
  );
};

/**
 * Auth layout với AuthProvider - Cho trang Login/Register
 */
export const AuthLayoutWithProvider = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

