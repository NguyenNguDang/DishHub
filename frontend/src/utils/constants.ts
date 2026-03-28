export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  RECIPES: '/recipes',
  RECIPE_DETAIL: '/recipes/:id',
  SHOPPING_LIST: '/shopping-list',
  PROFILE: '/profile',
  MEAL_PLANNER: '/meal-planner',
  SETTINGS: '/settings',
};

export const API_ENDPOINTS = {
  RECIPES: '/recipes',
  AUTH: '/auth',
  USERS: '/users',
  SHOPPING_LIST: '/shopping-list',
  MEAL_PLANS: '/meal-plans',
};

export const RECIPE_CATEGORIES = [
  { id: 'vietnamese', label: 'Các món ăn Việt', icon: '🍜' },
  { id: 'vegetarian', label: 'Ăn chay', icon: '🥗' },
  { id: 'international', label: 'Nước ngoài', icon: '🌍' },
  { id: 'dessert', label: 'Tráng miệng', icon: '🍰' },
  { id: 'breakfast', label: 'Bữa sáng', icon: '🥐' },
  { id: 'seafood', label: 'Hải sản', icon: '🦞' },
];

export const DIFFICULTY_LEVELS = [
  { id: 'easy', label: 'Dễ', color: 'bg-green-100 text-green-800' },
  { id: 'medium', label: 'Trung bình', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'hard', label: 'Khó', color: 'bg-red-100 text-red-800' },
];

export const PAGINATION_LIMIT = 12;
