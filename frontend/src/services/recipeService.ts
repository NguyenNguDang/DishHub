import axiosInstance from './api';
import type { Recipe, CreateRecipeRequest, UpdateRecipeRequest } from '../types';

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  recipeId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewRequest {
  rating: number;
  comment?: string;
}

/**
 * Recipe Service - API Client cho DishHub Recipe Management
 * Sử dụng axios instance từ api.ts (đã có interceptor cho token & error handling)
 */
export const recipeService = {
  /**
   * Lấy danh sách tất cả công thức
   */
  getAll: async (page = 0, limit = 12): Promise<Recipe[]> => {
    try {
      // Backend trả về Page object, không phải array
      // Note: Spring Boot dùng page 0-indexed
      const response = await axiosInstance.get<{ content: Recipe[] }>(
        `/v1/recipes?page=${page}&size=${limit}`
      );

      return response.data.content || [];
    } catch (error) {
      console.error('Error fetching recipes:', error);
      throw error;
    }
  },

  /**
   * Lấy chi tiết một công thức
   */
  getById: async (id: string): Promise<Recipe> => {
    try {
      const response = await axiosInstance.get<Recipe>(`/v1/recipes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching recipe ${id}:`, error);
      throw error;
    }
  },

  /**
   * Tạo công thức mới
   */
  create: async (
    recipe: CreateRecipeRequest | Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Recipe> => {
    try {
      const response = await axiosInstance.post<Recipe>('/v1/recipes', recipe);
      return response.data;
    } catch (error) {
      console.error('Error creating recipe:', error);
      throw error;
    }
  },

  /**
   * Cập nhật công thức
   */
  update: async (
    id: string,
    recipe: UpdateRecipeRequest | Partial<Recipe>
  ): Promise<Recipe> => {
    try {
      const response = await axiosInstance.put<Recipe>(`/v1/recipes/${id}`, recipe);
      return response.data;
    } catch (error) {
      console.error(`Error updating recipe ${id}:`, error);
      throw error;
    }
  },

  /**
   * Xóa công thức
   */
  delete: async (id: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/v1/recipes/${id}`);
    } catch (error) {
      console.error(`Error deleting recipe ${id}:`, error);
      throw error;
    }
  },

  /**
   * Tìm kiếm công thức
   */
  search: async (query: string): Promise<Recipe[]> => {
    try {
      // Sử dụng dedicated search endpoint từ backend
      const response = await axiosInstance.get<{ content: Recipe[] }>(`/v1/recipes/search?query=${encodeURIComponent(query)}&page=0&size=50`);
      const allRecipes = response.data.content || [];
      console.log('✅ Searched recipes:', allRecipes);
      return allRecipes;
    } catch (error) {
      console.error('Error searching recipes:', error);
      throw error;
    }
  },

  /**
   * Lấy công thức theo danh mục
   */
  getByCategory: async (category: string): Promise<Recipe[]> => {
    try {
      // Sử dụng dedicated category endpoint từ backend
      const response = await axiosInstance.get<{ content: Recipe[] }>(`/v1/recipes/category?category=${encodeURIComponent(category)}&page=0&size=50`);
      const allRecipes = response.data.content || [];
      console.log('📂 Category recipes:', allRecipes);
      return allRecipes;
    } catch (error) {
      console.error(`Error fetching recipes by category ${category}:`, error);
      throw error;
    }
  },

  // ==================== REVIEW APIs ====================

  /**
   * Lấy danh sách reviews của recipe
   */
  getRecipeReviews: async (recipeId: string, page = 0, size = 10): Promise<{ content: Review[] }> => {
    try {
      console.log('📥 Fetching reviews for recipe:', recipeId);
      const response = await axiosInstance.get<{ content: Review[] }>(
        `/v1/recipes/${recipeId}/reviews?page=${page}&size=${size}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching reviews for recipe ${recipeId}:`, error);
      throw error;
    }
  },

  /**
   * Tạo review mới
   */
  createReview: async (recipeId: string, review: ReviewRequest): Promise<Review> => {
    try {
      console.log('📝 Creating review for recipe:', recipeId);
      const response = await axiosInstance.post<Review>(
        `/v1/recipes/${recipeId}/reviews`,
        review
      );
      return response.data;
    } catch (error) {
      console.error(`Error creating review for recipe ${recipeId}:`, error);
      throw error;
    }
  },

  /**
   * Lấy danh sách công thức của user hiện tại
   */
  getUserRecipes: async (userId: string = 'me', page = 0, limit = 12): Promise<Recipe[]> => {
    try {
      // Backend trả về Page object, không phải array
      const response = await axiosInstance.get<{ content: Recipe[] }>(
        `/v1/recipes?userId=${userId}&page=${page}&size=${limit}`
      );

      return response.data.content || [];
    } catch (error) {
      console.error('Error fetching user recipes:', error);
      throw error;
    }
  },
};
