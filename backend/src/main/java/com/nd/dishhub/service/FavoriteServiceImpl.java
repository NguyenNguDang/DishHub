package com.nd.dishhub.service;

import com.nd.dishhub.DTO.response.RecipeResponse;
import com.nd.dishhub.model.FavoriteEntity;
import com.nd.dishhub.model.RecipeEntity;
import com.nd.dishhub.model.UserEntity;
import com.nd.dishhub.repository.FavoriteRepository;
import com.nd.dishhub.repository.RecipeRepository;
import com.nd.dishhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;
    private final RecipeService recipeService;

    @Override
    @Transactional(readOnly = true)
    public Page<RecipeResponse> getUserFavorites(Long userId, Pageable pageable) {
        // Verify user exists
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Get favorites and map to RecipeResponse
        Page<FavoriteEntity> favorites = favoriteRepository.findByUserId(userId, pageable);
        
        return favorites.map(favorite -> recipeService.getById(favorite.getRecipe().getId()));
    }

    @Override
    public void addFavorite(Long userId, Long recipeId) {
        // Verify user exists
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Verify recipe exists
        RecipeEntity recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("Recipe not found with id: " + recipeId));

        // Check if already favorited
        if (favoriteRepository.existsByUserIdAndRecipeId(userId, recipeId)) {
            throw new RuntimeException("Recipe is already favorited by this user");
        }

        // Create and save favorite
        FavoriteEntity favorite = FavoriteEntity.builder()
                .user(user)
                .recipe(recipe)
                .build();
        
        favoriteRepository.save(favorite);
    }

    @Override
    public void removeFavorite(Long userId, Long recipeId) {
        // Verify user exists
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Verify recipe exists
        RecipeEntity recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("Recipe not found with id: " + recipeId));

        // Check if favorite exists
        FavoriteEntity favorite = favoriteRepository.findByUserIdAndRecipeId(userId, recipeId)
                .orElseThrow(() -> new RuntimeException("Favorite not found"));

        favoriteRepository.delete(favorite);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isFavorite(Long userId, Long recipeId) {
        return favoriteRepository.existsByUserIdAndRecipeId(userId, recipeId);
    }

    @Override
    @Transactional(readOnly = true)
    public long getTotalFavoritesCount(Long userId) {
        return favoriteRepository.countByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public long getRecipeFavoritesCount(Long recipeId) {
        return favoriteRepository.countByRecipeId(recipeId);
    }
}

