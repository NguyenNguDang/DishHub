import { useQuery, useMutation } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Recipe, CreateRecipeRequest, UpdateRecipeRequest } from '../types';
import { recipeService } from '../services';
import { queryClient } from '../config/queryClient';

/**
 * Lấy tất cả recipes
 */
export const useGetRecipes = (options?: UseQueryOptions<Recipe[], Error>) => {
  return useQuery({
    queryKey: ['recipes'],
    queryFn: async () => {
      return recipeService.getAll();
    },
    staleTime: 1000 * 60 * 5, // 5 phút
    gcTime: 1000 * 60 * 10, // 10 phút
    ...options,
  });
};

/**
 * Lấy 1 recipe theo id
 */
export const useGetRecipeById = (
  id: string,
  options?: UseQueryOptions<Recipe, Error>
) => {
  return useQuery({
    queryKey: ['recipe', id],
    queryFn: async () => {
      return recipeService.getById(id);
    },
    enabled: !!id, // Chỉ fetch khi có id
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    ...options,
  });
};

/**
 * tìm kiếm recipe
 */
export const useSearchRecipes = (
  query: string,
  options?: UseQueryOptions<Recipe[], Error>
) => {
  return useQuery({
    queryKey: ['recipes', 'search', query],
    queryFn: async () => {
      return recipeService.search(query);
    },
    enabled: !!query, // Chỉ fetch khi có query
    staleTime: 1000 * 60 * 2, // 2 phút
    ...options,
  });
};

/**
 * Lấy recipe theo danh mục
 */
export const useGetRecipesByCategory = (
  category: string,
  options?: UseQueryOptions<Recipe[], Error>
) => {
  return useQuery({
    queryKey: ['recipes', 'category', category],
    queryFn: async () => {
      return recipeService.getByCategory(category);
    },
    enabled: !!category,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    ...options,
  });
};

/**
 * Lấy recipes của user
 */
export const useGetUserRecipes = (
  userId: string = 'me',
  page: number = 0,
  limit: number = 12,
  options?: UseQueryOptions<Recipe[], Error>
) => {
  return useQuery({
    queryKey: ['recipes', 'user', userId, page],
    queryFn: async () => {
      return recipeService.getUserRecipes(userId, page, limit);
    },
    staleTime: 1000 * 60 * 5, // 5 phút
    gcTime: 1000 * 60 * 10, // 10 phút
    ...options,
  });
};


/**
 * tạo công thức mới
 */
export const useAddRecipe = (
  options?: UseMutationOptions<Recipe, Error, CreateRecipeRequest>
) => {
  return useMutation({
    mutationFn: async (recipeData: CreateRecipeRequest) => {
      return recipeService.create(recipeData);
    },
    onSuccess: async (newRecipe: Recipe) => {
      // Invalidate danh sách công thức để fetch lại
      await queryClient.invalidateQueries({ queryKey: ['recipes'] });
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
 * cập nhật công thức
 */
export const useUpdateRecipe = (
  options?: UseMutationOptions<Recipe, Error, { id: string; data: UpdateRecipeRequest }>
) => {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateRecipeRequest }) => {
      return recipeService.update(id, data);
    },
    onSuccess: async (updatedRecipe: Recipe) => {
      // Invalidate danh sách công thức
      await queryClient.invalidateQueries({ queryKey: ['recipes'] });
      
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
 * xóa công thức
 */
export const useDeleteRecipe = (
  options?: UseMutationOptions<void, Error, string>
) => {
  return useMutation({
    mutationFn: async (id: string) => {
      return recipeService.delete(id);
    },
    onSuccess: async (_, deletedId: string) => {
      // Invalidate danh sách công thức
      await queryClient.invalidateQueries({ queryKey: ['recipes'] });
      
      // Xóa công thức khỏi cache
      queryClient.removeQueries({ queryKey: ['recipe', deletedId] });
    },
    onError: (error: Error) => {
      console.error('Failed to delete recipe:', error);
    },
    ...options,
  });
};

