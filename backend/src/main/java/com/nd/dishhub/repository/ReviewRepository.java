package com.nd.dishhub.repository;

import com.nd.dishhub.model.ReviewEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<ReviewEntity, Long> {

    /**
     * Tìm reviews của user
     */
    List<ReviewEntity> findByUserId(Long userId);

    /**
     * Tìm reviews của recipe
     */
    List<ReviewEntity> findByRecipeId(Long recipeId);

    /**
     * Tìm review duy nhất của user cho recipe
     */
    Optional<ReviewEntity> findByUserIdAndRecipeId(Long userId, Long recipeId);

    /**
     * Kiểm tra user đã review recipe chưa
     */
    boolean existsByUserIdAndRecipeId(Long userId, Long recipeId);

    /**
     * Tìm reviews theo rating
     */
    List<ReviewEntity> findByRating(Integer rating);

    /**
     * Tìm reviews cao hơn rating cụ thể
     */
    List<ReviewEntity> findByRatingGreaterThanEqual(Integer minRating);

    /**
     * Tìm reviews của user theo rating
     */
    List<ReviewEntity> findByUserIdAndRatingGreaterThanEqual(Long userId, Integer minRating);

    /**
     * Tìm reviews của recipe cao hơn rating cụ thể
     */
    List<ReviewEntity> findByRecipeIdAndRatingGreaterThanEqual(Long recipeId, Integer minRating);

    /**
     * Tìm review với user và recipe details
     */
    @Query("SELECT DISTINCT r FROM ReviewEntity r " +
           "LEFT JOIN FETCH r.user " +
           "LEFT JOIN FETCH r.recipe " +
           "WHERE r.id = :id")
    Optional<ReviewEntity> findByIdWithDetails(@Param("id") Long id);

    /**
     * Lấy reviews của recipe với phân trang
     */
    Page<ReviewEntity> findByRecipeId(Long recipeId, Pageable pageable);

    /**
     * Lấy reviews của recipe sắp xếp theo rating
     */
    @Query("SELECT r FROM ReviewEntity r " +
           "WHERE r.recipe.id = :recipeId " +
           "ORDER BY r.rating DESC, r.createdAt DESC")
    Page<ReviewEntity> findByRecipeIdOrderByRating(@Param("recipeId") Long recipeId, Pageable pageable);

    /**
     * Tìm reviews của user với phân trang
     */
    Page<ReviewEntity> findByUserId(Long userId, Pageable pageable);

    /**
     * Tính rating trung bình của recipe
     */
    @Query("SELECT AVG(CAST(r.rating AS DOUBLE)) FROM ReviewEntity r " +
           "WHERE r.recipe.id = :recipeId")
    Double findAverageRatingByRecipeId(@Param("recipeId") Long recipeId);

    /**
     * Đếm reviews của recipe
     */
    long countByRecipeId(Long recipeId);

    /**
     * Đếm reviews 5 sao của recipe
     */
    long countByRecipeIdAndRating(Long recipeId, Integer rating);

    /**
     * Tìm recipes được review nhiều nhất
     */
    @Query("SELECT r.recipe.id, COUNT(r) as reviewCount " +
           "FROM ReviewEntity r " +
           "GROUP BY r.recipe.id " +
           "ORDER BY reviewCount DESC")
    List<Object[]> findMostReviewedRecipes();

    /**
     * Tìm top reviewers (users review nhiều nhất)
     */
    @Query("SELECT r.user.id, COUNT(r) as reviewCount " +
           "FROM ReviewEntity r " +
           "GROUP BY r.user.id " +
           "ORDER BY reviewCount DESC")
    List<Object[]> findTopReviewers();
}

