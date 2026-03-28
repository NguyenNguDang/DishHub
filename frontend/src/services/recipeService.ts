import { apiClient } from './api';
import type { Recipe } from '../types';

export const recipeService = {
  getAll: async (page = 1, limit = 12) => {
    return apiClient.get<Recipe[]>(`/recipes?page=${page}&limit=${limit}`);
  },

  getById: async (id: string) => {
    return apiClient.get<Recipe>(`/recipes/${id}`);
  },

  create: async (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => {
    return apiClient.post<Recipe>('/recipes', recipe);
  },

  update: async (id: string, recipe: Partial<Recipe>) => {
    return apiClient.put<Recipe>(`/recipes/${id}`, recipe);
  },

  delete: async (id: string) => {
    return apiClient.delete(`/recipes/${id}`);
  },

  search: async (query: string) => {
    return apiClient.get<Recipe[]>(`/recipes/search?q=${query}`);
  },
};
