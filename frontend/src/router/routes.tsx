import type { RouteObject } from 'react-router-dom';
import { createBrowserRouter } from 'react-router-dom';
import { RootLayoutWithAuth, AuthLayoutWithProvider } from './layouts';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import RecipeExplorerPage from '../pages/RecipeExplorerPage';
import RecipeDetailPage from '../pages/RecipeDetailPage';
import ShoppingListPage from '../pages/ShoppingListPage';
import { UserProfilePage } from '../pages/UserProfilePage';
import WeeklyMealPlannerPage from '../pages/WeeklyMealPlannerPage';
import MyRecipesPage from '../pages/MyRecipesPage';
import { AddRecipePage } from '../pages/AddRecipePage';
import { EditRecipePage } from '../pages/EditRecipePage';
import { NotFound } from '../pages/NotFoundPage';

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
        path: '/recipes/add',
        element: <AddRecipePage />,
      },
      {
        path: '/recipes/edit/:id',
        element: <EditRecipePage />,
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
