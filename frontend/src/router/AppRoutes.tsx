/**
 * AppRoutes.tsx
 * Định nghĩa tất cả routes cho ứng dụng DishHub với TypeScript strict mode
 * 
 * ✨ Features:
 * - Type-safe route paths sử dụng const as const
 * - Route params interface cho strict type checking
 * - Helper functions để generate URLs
 * - Organized routes object để dễ navigate
 */

/**
 * Type-safe route paths
 * Sử dụng const as const để TypeScript có thể infer literal types
 */
export const ROUTE_PATHS = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  RECIPES: '/recipes',
  RECIPE_DETAIL: '/recipes/:id',
  RECIPE_NEW: '/recipe/new',
  SHOPPING_LIST: '/shopping-list',
  PROFILE: '/profile',
  MEAL_PLANNER: '/meal-planner',
  NOT_FOUND: '*',
} as const;

/**
 * Type để lấy route params
 * Ví dụ: RecipeDetailParams sẽ có type { id: string }
 */
export interface RecipeDetailParams {
  id: string;
}

/**
 * Utility function để generate URL với params
 * Cung cấp type-safe URL generation
 */
export const generateRecipeUrl = (id: string): string => {
  return `/recipes/${id}`;
};

/**
 * Routes object - dễ dàng navigate với autocomplete
 * 
 * Cách sử dụng:
 * - routes.home → "/"
 * - routes.recipes → "/recipes"
 * - routes.recipeDetail("123") → "/recipes/123"
 */
export const routes = {
  home: ROUTE_PATHS.HOME,
  login: ROUTE_PATHS.LOGIN,
  register: ROUTE_PATHS.REGISTER,
  recipes: ROUTE_PATHS.RECIPES,
  recipeDetail: (id: string) => `/recipes/${id}`,
  recipeNew: ROUTE_PATHS.RECIPE_NEW,
  shoppingList: ROUTE_PATHS.SHOPPING_LIST,
  profile: ROUTE_PATHS.PROFILE,
  mealPlanner: ROUTE_PATHS.MEAL_PLANNER,
} as const;
