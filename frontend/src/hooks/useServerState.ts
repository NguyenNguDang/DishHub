import { useQuery, useMutation } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { queryClient } from '../config/queryClient';
import type {
  Recipe,
  ShoppingList,
  ShoppingListItem,
  UserProfile,
  CreateRecipeRequest,
  UpdateRecipeRequest,
  UpdateUserProfileRequest,
  CreateShoppingListItemRequest,
  UpdateShoppingListItemRequest,
} from '../types';

// ==================== RECIPE QUERIES ====================

export const useFetchRecipes = (options?: UseQueryOptions<Recipe[], Error>) => {
  return useQuery({
    queryKey: ['recipes'],
    queryFn: async () => {
      const res = await fetch('/api/recipes');
      if (!res.ok) throw new Error('Failed to fetch recipes');
      return res.json();
    },
    ...options,
  });
};

export const useFetchRecipeDetail = (id: string, options?: UseQueryOptions<Recipe, Error>) => {
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: async () => {
      const res = await fetch(`/api/recipes/${id}`);
      if (!res.ok) throw new Error('Failed to fetch recipe');
      return res.json();
    },
    enabled: !!id,
    ...options,
  });
};

// ==================== RECIPE MUTATIONS ====================

export const useCreateRecipe = (
  options?: UseMutationOptions<Recipe, Error, CreateRecipeRequest>
) => {
  return useMutation({
    mutationFn: async (recipeData: CreateRecipeRequest) => {
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipeData),
      });
      if (!res.ok) throw new Error('Failed to create recipe');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
    ...options,
  });
};

export const useUpdateRecipe = (
  options?: UseMutationOptions<Recipe, Error, { id: string; data: UpdateRecipeRequest }>
) => {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateRecipeRequest }) => {
      const res = await fetch(`/api/recipes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update recipe');
      return res.json();
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      queryClient.invalidateQueries({ queryKey: ['recipe', id] });
    },
    ...options,
  });
};

export const useDeleteRecipe = (options?: UseMutationOptions<void, Error, string>) => {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/recipes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete recipe');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
    ...options,
  });
};

// ==================== SHOPPING LIST QUERIES ====================

export const useFetchShoppingList = (options?: UseQueryOptions<ShoppingList, Error>) => {
  return useQuery({
    queryKey: ['shopping-list'],
    queryFn: async () => {
      const res = await fetch('/api/shopping-list');
      if (!res.ok) throw new Error('Failed to fetch shopping list');
      return res.json();
    },
    ...options,
  });
};

// ==================== SHOPPING LIST MUTATIONS ====================

export const useAddShoppingListItem = (
  options?: UseMutationOptions<ShoppingListItem, Error, CreateShoppingListItemRequest>
) => {
  return useMutation({
    mutationFn: async (itemData: CreateShoppingListItemRequest) => {
      const res = await fetch('/api/shopping-list/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      });
      if (!res.ok) throw new Error('Failed to add item');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopping-list'] });
    },
    ...options,
  });
};

export const useUpdateShoppingListItem = (
  options?: UseMutationOptions<
    ShoppingListItem,
    Error,
    { id: string; data: UpdateShoppingListItemRequest }
  >
) => {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateShoppingListItemRequest }) => {
      const res = await fetch(`/api/shopping-list/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update item');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopping-list'] });
    },
    ...options,
  });
};

export const useDeleteShoppingListItem = (options?: UseMutationOptions<void, Error, string>) => {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/shopping-list/items/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete item');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopping-list'] });
    },
    ...options,
  });
};

// ==================== USER PROFILE QUERIES ====================

export const useFetchUserProfile = (options?: UseQueryOptions<UserProfile, Error>) => {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const res = await fetch('/api/user/profile');
      if (!res.ok) throw new Error('Failed to fetch user profile');
      return res.json();
    },
    ...options,
  });
};

// ==================== USER PROFILE MUTATIONS ====================

export const useUpdateUserProfile = (
  options?: UseMutationOptions<UserProfile, Error, UpdateUserProfileRequest>
) => {
  return useMutation({
    mutationFn: async (profileData: UpdateUserProfileRequest) => {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
    ...options,
  });
};

