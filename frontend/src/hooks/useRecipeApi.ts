import { useQuery, useMutation } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Recipe, CreateRecipeRequest, UpdateRecipeRequest } from '../types';
import { recipeApiClient } from '../services/recipeApi';
import { queryClient } from '../config/queryClient';

// ==================== QUERIES ====================

/**
 * Hook để lấy danh sách tất cả công thức
 * Dữ liệu được cache và tự động cập nhật
 */
export const useGetRecipes = (options?: UseQueryOptions<Recipe[], Error>) => {
  return useQuery({
    queryKey: ['recipes'],
    queryFn: async () => {
      return recipeApiClient.getRecipes();
    },
    staleTime: 1000 * 60 * 5, // 5 phút
    gcTime: 1000 * 60 * 10, // 10 phút
    ...options,
  });
};

/**
 * Hook để lấy chi tiết một công thức
 */
export const useGetRecipeById = (
  id: string,
  options?: UseQueryOptions<Recipe, Error>
) => {
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: async () => {
      return recipeApiClient.getRecipeById(id);
    },
    enabled: !!id, // Chỉ fetch khi có id
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    ...options,
  });
};

/**
 * Hook để tìm kiếm công thức
 */
export const useSearchRecipes = (
  query: string,
  options?: UseQueryOptions<Recipe[], Error>
) => {
  return useQuery({
    queryKey: ['recipes', 'search', query],
    queryFn: async () => {
      return recipeApiClient.searchRecipes(query);
    },
    enabled: !!query, // Chỉ fetch khi có query
    staleTime: 1000 * 60 * 2, // 2 phút
    ...options,
  });
};

/**
 * Hook để lấy công thức theo danh mục
 */
export const useGetRecipesByCategory = (
  category: string,
  options?: UseQueryOptions<Recipe[], Error>
) => {
  return useQuery({
    queryKey: ['recipes', 'category', category],
    queryFn: async () => {
      return recipeApiClient.getRecipesByCategory(category);
    },
    enabled: !!category,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    ...options,
  });
};

// ==================== MUTATIONS ====================

/**
 * Hook để tạo công thức mới
 * Tự động invalidate cache khi thành công
 */
export const useAddRecipe = (
  options?: UseMutationOptions<Recipe, Error, CreateRecipeRequest>
) => {
  return useMutation({
    mutationFn: async (recipeData: CreateRecipeRequest) => {
      return recipeApiClient.createRecipe(recipeData);
    },
    onSuccess: (newRecipe: Recipe) => {
      // Invalidate danh sách công thức để fetch lại
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      
      // Thêm công thức mới vào cache
      queryClient.setQueryData(['recipe', newRecipe.id], newRecipe);
    },
    onError: (error: Error) => {
      console.error('Failed to add recipe:', error);
    },
    ...options,
  });
};

/**
 * Hook để cập nhật công thức
 * Tự động cập nhật cache khi thành công
 */
export const useUpdateRecipe = (
  options?: UseMutationOptions<Recipe, Error, { id: string; data: UpdateRecipeRequest }>
) => {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateRecipeRequest }) => {
      return recipeApiClient.updateRecipe(id, data);
    },
    onSuccess: (updatedRecipe: Recipe) => {
      // Invalidate danh sách công thức
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      
      // Cập nhật cache của công thức cụ thể
      queryClient.setQueryData(['recipe', updatedRecipe.id], updatedRecipe);
    },
    onError: (error: Error) => {
      console.error('Failed to update recipe:', error);
    },
    ...options,
  });
};

/**
 * Hook để xóa công thức
 * Tự động xóa khỏi cache khi thành công
 */
export const useDeleteRecipe = (
  options?: UseMutationOptions<void, Error, string>
) => {
  return useMutation({
    mutationFn: async (id: string) => {
      return recipeApiClient.deleteRecipe(id);
    },
    onSuccess: (_, deletedId: string) => {
      // Invalidate danh sách công thức
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      
      // Xóa công thức khỏi cache
      queryClient.removeQueries({ queryKey: ['recipe', deletedId] });
    },
    onError: (error: Error) => {
      console.error('Failed to delete recipe:', error);
    },
    ...options,
  });
};

