package com.nd.dishhub.repository;

import com.nd.dishhub.model.RecipeEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecipeRepository extends JpaRepository<RecipeEntity, Long> {

    /**
     * Tìm recipes theo user ID
     */
    List<RecipeEntity> findByUserId(Long userId);

    /**
     * Tìm recipes theo user ID với pagination
     */
    Page<RecipeEntity> findByUserId(Long userId, Pageable pageable);

    /**
     * Tìm public recipes
     */
    Page<RecipeEntity> findByIsPublicTrue(Pageable pageable);

    /**
     * Tìm recipes theo title (partial match)
     */
    List<RecipeEntity> findByTitleContaining(String title);

    /**
     * Tìm recipe với tất cả ingredients
     */
    @Query("SELECT DISTINCT r FROM RecipeEntity r " +
           "LEFT JOIN FETCH r.recipeIngredients " +
           "WHERE r.id = :id")
    Optional<RecipeEntity> findByIdWithIngredients(@Param("id") Long id);

    /**
     * Tìm recipe với tất cả tags
     */
    @Query("SELECT DISTINCT r FROM RecipeEntity r " +
           "LEFT JOIN FETCH r.tags " +
           "WHERE r.id = :id")
    Optional<RecipeEntity> findByIdWithTags(@Param("id") Long id);

    /**
     * Tìm recipe với owner user
     */
    @Query("SELECT DISTINCT r FROM RecipeEntity r " +
           "LEFT JOIN FETCH r.user " +
           "WHERE r.id = :id")
    Optional<RecipeEntity> findByIdWithUser(@Param("id") Long id);

    /**
     * Tìm recipe với tất cả relationships
     */
    @Query("SELECT DISTINCT r FROM RecipeEntity r " +
           "LEFT JOIN FETCH r.user " +
           "LEFT JOIN FETCH r.recipeIngredients " +
           "LEFT JOIN FETCH r.tags " +
           "LEFT JOIN FETCH r.reviews " +
           "WHERE r.id = :id")
    Optional<RecipeEntity> findByIdWithAllRelationships(@Param("id") Long id);

    /**
     * Tìm recipes của user theo title
     */
    @Query("SELECT r FROM RecipeEntity r WHERE r.user.id = :userId AND r.title LIKE %:title%")
    List<RecipeEntity> findByUserIdAndTitle(@Param("userId") Long userId, @Param("title") String title);

    /**
     * Tìm variations của một recipe
     */
    @Query("SELECT r FROM RecipeEntity r WHERE r.parent.id = :parentId")
    List<RecipeEntity> findVariationsByParentId(@Param("parentId") Long parentId);

    /**
     * Tìm recipes có tag cụ thể
     */
    @Query("SELECT DISTINCT r FROM RecipeEntity r " +
           "WHERE r.tags LIKE %:tagName% AND r.isPublic = true")
    Page<RecipeEntity> findPublicRecipesByTag(@Param("tagName") String tagName, Pageable pageable);

    /**
     * Tìm recipes có rating cao
     */
    @Query("SELECT r FROM RecipeEntity r " +
           "LEFT JOIN r.reviews rev " +
           "GROUP BY r.id " +
           "HAVING AVG(CAST(rev.rating AS DOUBLE)) >= :minRating " +
           "ORDER BY AVG(CAST(rev.rating AS DOUBLE)) DESC")
    Page<RecipeEntity> findRecipesByAverageRating(@Param("minRating") Double minRating, Pageable pageable);

    /**
     * Tìm recipes private của user (custom recipes)
     */
    @Query("SELECT r FROM RecipeEntity r WHERE r.user.id = :userId AND r.isPublic = false")
    Page<RecipeEntity> findPrivateRecipesByUser(@Param("userId") Long userId, Pageable pageable);

    /**
     * Tìm recipes public theo title (search)
     */
    @Query("SELECT r FROM RecipeEntity r WHERE r.isPublic = true " +
           "AND (LOWER(r.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(r.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<RecipeEntity> searchPublicRecipes(@Param("query") String query, Pageable pageable);

    /**
     * Tìm recipes public theo category
     */
    @Query("SELECT r FROM RecipeEntity r WHERE r.isPublic = true AND r.category = :category")
    Page<RecipeEntity> findPublicRecipesByCategory(@Param("category") String category, Pageable pageable);
}
