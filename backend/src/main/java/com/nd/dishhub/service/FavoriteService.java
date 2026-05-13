package com.nd.dishhub.service;

import com.nd.dishhub.DTO.response.RecipeResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface FavoriteService {

    /**
     * Get all favorite recipes for a user with pagination
     */
    Page<RecipeResponse> getUserFavorites(Long userId, Pageable pageable);

    /**
     * Add a recipe to favorites
     */
    void addFavorite(Long userId, Long recipeId);

    /**
     * Remove a recipe from favorites
     */
    void removeFavorite(Long userId, Long recipeId);

    /**
     * Check if a recipe is favorited by a user
     */
    boolean isFavorite(Long userId, Long recipeId);

    /**
     * Count total favorites for a user
     */
    long getTotalFavoritesCount(Long userId);

    /**
     * Count how many times a recipe has been favorited
     */
    long getRecipeFavoritesCount(Long recipeId);
}

