// Auth Types
export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  createdAt: Date;
}

export interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
}

// Recipe Types
export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  cookTime: number;
  prepTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  tags: string[];
  rating: number;
  reviews: number;
  ingredients: Ingredient[];
  instructions: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface RecipeFilter {
  search: string;
  category: string;
  difficulty: string;
  cookTime: number; // max cook time
  sortBy: 'rating' | 'popular' | 'newest';
}

// Common Types
export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface NavItem {
  label: string;
  path: string;
  icon: string;
  badge?: number;
}

// Shopping List Types
export interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  isChecked: boolean;
  addedAt: Date;
}

export interface ShoppingList {
  id: string;
  userId: string;
  items: ShoppingListItem[];
  createdAt: Date;
  updatedAt: Date;
}

// User Profile Types
export interface UserProfile extends User {
  bio?: string;
  favoriteRecipes: string[];
  followers: number;
  following: number;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: 'en' | 'vi';
  notifications: boolean;
  dietaryRestrictions: string[];
}

// API Request Types
export interface CreateRecipeRequest {
  title: string;
  description: string;
  image: string;
  cookTime: number;
  prepTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  tags: string[];
  ingredients: Ingredient[];
  instructions: string[];
}

export interface UpdateRecipeRequest extends Partial<CreateRecipeRequest> {}

export interface UpdateUserProfileRequest extends Partial<Omit<UserProfile, 'id' | 'createdAt'>> {}

export interface CreateShoppingListItemRequest {
  name: string;
  quantity: number;
  unit: string;
  category: string;
}

export interface UpdateShoppingListItemRequest extends Partial<CreateShoppingListItemRequest> {
  isChecked?: boolean;
}
