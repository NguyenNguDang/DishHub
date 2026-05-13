import { useQuery, useMutation, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query";
import type { Recipe } from "../types";
import { favoritesService } from "../services";
import { queryClient } from "../config/queryClient";

/** * Lấy danh sách công thức yêu thích */
export const useGetFavorites = (
    userId: string = 'me',
    page: number = 0,
    limit: number = 12,
    options?: UseQueryOptions<Recipe[], Error>
) => {
    return useQuery({
        queryKey: ['favorites', userId, page],
        queryFn: async () => {
            return favoritesService.getFavorites(userId, page, limit);
        },
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        ...options,
    });
};


/** * Thêm công thức vào yêu thích */
export const useAddFavorite = (
    options?: UseMutationOptions<void, Error, string>
) => {
    return useMutation({
        mutationFn: async (recipeId: string) => {
            return favoritesService.addFavorite(recipeId);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['favorites'] });
        },
        ...options,
    });
};

/** * Xóa công thức khỏi yêu thích */
export const useRemoveFavorite = (
    options?: UseMutationOptions<void, Error, string>
) => {
    return useMutation({
        mutationFn: async (recipeId: string) => {
            return favoritesService.removeFavorite(recipeId);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['favorites'] });
        },
        ...options,
    });
};