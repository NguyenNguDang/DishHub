import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { Recipe, CreateRecipeRequest, UpdateRecipeRequest } from '../types';

/**
 * API Client cho DishHub Recipe Management
 * Base URL: http://localhost:8080/api/v1 (có thể thay đổi)
 */
class RecipeApiClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string = 'http://localhost:8080/api/v1') {
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    // Interceptor để thêm auth token nếu cần
    this.axiosInstance.interceptors.request.use((config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Interceptor để handle errors
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Lấy danh sách tất cả công thức
   */
  async getRecipes(): Promise<Recipe[]> {
    try {
      // Backend trả về Page object, không phải array
      const response = await this.axiosInstance.get<{ content: Recipe[] }>('/recipes');
      return response.data.content || [];
    } catch (error) {
      console.error('Error fetching recipes:', error);
      throw error;
    }
  }

  /**
   * Lấy chi tiết một công thức
   */
  async getRecipeById(id: string): Promise<Recipe> {
    try {
      const response = await this.axiosInstance.get<Recipe>(`/recipes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching recipe ${id}:`, error);
      throw error;
    }
  }

  /**
   * Tạo công thức mới
   */
  async createRecipe(recipeData: CreateRecipeRequest): Promise<Recipe> {
    try {
      const response = await this.axiosInstance.post<Recipe>('/recipes', recipeData);
      return response.data;
    } catch (error) {
      console.error('Error creating recipe:', error);
      throw error;
    }
  }

  /**
   * Cập nhật công thức
   */
  async updateRecipe(id: string, recipeData: UpdateRecipeRequest): Promise<Recipe> {
    try {
      const response = await this.axiosInstance.put<Recipe>(`/recipes/${id}`, recipeData);
      return response.data;
    } catch (error) {
      console.error(`Error updating recipe ${id}:`, error);
      throw error;
    }
  }

  /**
   * Xóa công thức
   */
  async deleteRecipe(id: string): Promise<void> {
    try {
      await this.axiosInstance.delete(`/recipes/${id}`);
    } catch (error) {
      console.error(`Error deleting recipe ${id}:`, error);
      throw error;
    }
  }

  /**
   * Tìm kiếm công thức theo tiêu chí
   */
  async searchRecipes(query: string): Promise<Recipe[]> {
    try {
      // Note: Backend không có dedicated search endpoint
      // Sử dụng getPublicRecipes và filter client-side
      const response = await this.axiosInstance.get<{ content: Recipe[] }>('/recipes/public');
      const allRecipes = response.data.content || [];
      return allRecipes.filter(recipe => 
        recipe.title.toLowerCase().includes(query.toLowerCase()) ||
        recipe.description?.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching recipes:', error);
      throw error;
    }
  }

  /**
   * Lấy công thức theo danh mục
   */
  async getRecipesByCategory(category: string): Promise<Recipe[]> {
    try {
      // Note: Backend không có dedicated category endpoint
      // Sử dụng getPublicRecipes và filter client-side
      const response = await this.axiosInstance.get<{ content: Recipe[] }>('/recipes/public');
      const allRecipes = response.data.content || [];
      return allRecipes.filter(recipe => 
        recipe.category.toLowerCase() === category.toLowerCase()
      );
    } catch (error) {
      console.error(`Error fetching recipes by category ${category}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const recipeApiClient = new RecipeApiClient();

