package com.nd.dishhub.repository;

import com.nd.dishhub.model.FavoriteEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<FavoriteEntity, Long> {

    /**
     * Find a favorite by user id and recipe id
     */
    Optional<FavoriteEntity> findByUserIdAndRecipeId(Long userId, Long recipeId);

    /**
     * Check if a favorite exists
     */
    boolean existsByUserIdAndRecipeId(Long userId, Long recipeId);

    /**
     * Get all favorites for a user with pagination
     */
    Page<FavoriteEntity> findByUserId(Long userId, Pageable pageable);

    /**
     * Delete a favorite by user id and recipe id
     */
    void deleteByUserIdAndRecipeId(Long userId, Long recipeId);

    /**
     * Count favorites for a user
     */
    long countByUserId(Long userId);

    /**
     * Count how many times a recipe is favorited
     */
    long countByRecipeId(Long recipeId);
}

