package com.nd.dishhub.repository;

import com.nd.dishhub.model.ReviewEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {
    /**
     * Kiểm tra user đã review recipe chưa
     */
    boolean existsByUserIdAndRecipeId(Long userId, Long recipeId);
    
    /**
     * Tìm review với user và recipe details
     */
    @Query("SELECT DISTINCT r FROM ReviewEntity r " +
           "LEFT JOIN FETCH r.user " +
           "LEFT JOIN FETCH r.recipe " +
           "WHERE r.id = :id")
    Optional<ReviewEntity> findByIdWithDetails(@Param("id") Long id);
    
    /**
     * Lấy reviews của recipe sắp xếp theo rating
     */
    @Query("SELECT r FROM ReviewEntity r " +
           "WHERE r.recipe.id = :recipeId " +
           "ORDER BY r.rating DESC, r.createdAt DESC")
    Page<ReviewEntity> findByRecipeIdOrderByRating(@Param("recipeId") Long recipeId, Pageable pageable);
    

    /**
     * Tính rating trung bình của recipe
     */
    @Query("SELECT AVG(CAST(r.rating AS DOUBLE)) FROM ReviewEntity r " +
           "WHERE r.recipe.id = :recipeId")
    Double findAverageRatingByRecipeId(@Param("recipeId") Long recipeId);

    /**
     * Đếm reviews của recipe
     */
    int countByRecipeId(Long recipeId);
    
}

