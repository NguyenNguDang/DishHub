import axiosInstance from "./api"
import type { Recipe } from "../types";

export const favoritesService = {
    /**
     * Lấy danh sách công thức yêu thích của user
     */
    getFavorites: async (userId: string = 'me', page: number = 0, limit: number = 12): Promise<Recipe[]> => {
        try {
            const response = await axiosInstance.get<{ content: Recipe[] }>(
                `/v1/users/${userId}/favorites?page=${page}&size=${limit}`
            );
            return response.data.content || [];
        } catch (error) {
            console.error('Error fetching favorites:', error);
            throw error;
        }
    },

    /**
     * Thêm công thức vào danh sách yêu thích
     */
    addFavorite: async (recipeId: string): Promise<void> => {
        try {
            await axiosInstance.post(`/v1/recipes/${recipeId}/favorite`);
        } catch (_error) {
            console.error('Error adding favorite:', _error);
            throw _error;
        }
    },

    /**
     * Xóa công thức khỏi danh sách yêu thích
     */
    removeFavorite: async (recipeId: string): Promise<void> => {
        try {
            await axiosInstance.delete(`/v1/recipes/${recipeId}/favorite`);
        } catch (_error) {
            console.error('Error removing favorite:', _error);
            throw _error;
        }
    },

    /**
     * Kiểm tra công thức có yêu thích không
     */
    isFavorite: async (recipeId: string): Promise<boolean> => {
        try {
            const response = await axiosInstance.get(`/v1/recipes/${recipeId}/favorite`);
            return response.status === 200;
        } catch {
            return false;
        }
    }
};