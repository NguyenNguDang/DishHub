/**
 * AppRoutes.tsx
 * Type-safe route helpers và constants cho DishHub
 */

/**
 * Type-safe route paths - Sử dụng const as const để TypeScript infer literal types
 */
export const ROUTE_PATHS = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  RECIPES: '/recipes',
  RECIPE_DETAIL: '/recipes/:id',
  MY_RECIPES: '/my-recipes',
  SHOPPING_LIST: '/shopping-list',
  PROFILE: '/profile',
  MEAL_PLANNER: '/meal-planner',
  NOT_FOUND: '*',
} as const;

/**
 * Routes helper object - Dễ dàng navigate với autocomplete
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
  myRecipes: ROUTE_PATHS.MY_RECIPES,
  shoppingList: ROUTE_PATHS.SHOPPING_LIST,
  profile: ROUTE_PATHS.PROFILE,
  mealPlanner: ROUTE_PATHS.MEAL_PLANNER,
} as const;


