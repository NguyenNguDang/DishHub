import type { RouteObject } from 'react-router-dom';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import { MainLayout } from '../components';
import { AuthProvider } from '../store';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import RecipeExplorerPage from '../pages/RecipeExplorerPage';
import RecipeDetailPage from '../pages/RecipeDetailPage';
import ShoppingListPage from '../pages/ShoppingListPage';
import { UserProfilePage } from '../pages/UserProfilePage';
import WeeklyMealPlannerPage from '../pages/WeeklyMealPlannerPage';
import MyRecipesPage from '../pages/MyRecipesPage';
import { NotFound } from '../pages/NotFoundPage';
import { useAuthStore } from '../store';

// Root layout component
const RootLayout = () => {
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

// Wrap RootLayout with AuthProvider
const RootLayoutWithAuth = () => {
  return (
    <AuthProvider>
      <RootLayout />
    </AuthProvider>
  );
};

// Auth layout với AuthProvider
const AuthLayoutWithProvider = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootLayoutWithAuth />,
    children: [
      {
        path: '/',
        element: <RecipeExplorerPage />,
      },
      {
        path: '/recipes',
        element: <RecipeExplorerPage />,
      },
      {
        path: '/recipes/:id',
        element: <RecipeDetailPage />,
      },
      {
        path: '/my-recipes',
        element: <MyRecipesPage />,
      },
      {
        path: '/shopping-list',
        element: <ShoppingListPage />,
      },
      {
        path: '/profile',
        element: <UserProfilePage />,
      },
      {
        path: '/meal-planner',
        element: <WeeklyMealPlannerPage />,
      },
    ],
  },
  {
    path: '/',
    element: <AuthLayoutWithProvider />,
    children: [
      {
        path: '/login',
        element: <LoginPage onSwitchToRegister={() => {}} onLoginSuccess={() => {}} />,
      },
      {
        path: '/register',
        element: <RegisterPage onSwitchToLogin={() => {}} />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export const router = createBrowserRouter(routes);
