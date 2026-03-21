package com.nd.dishhub.repository;

import com.nd.dishhub.model.MealPlanEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MealPlanRepository extends JpaRepository<MealPlanEntity, Long> {

    /**
     * Tìm meal plans theo user ID
     */
    List<MealPlanEntity> findByUserId(Long userId);

    /**
     * Tìm meal plans của user theo ngày
     */
    List<MealPlanEntity> findByUserIdAndPlanDate(Long userId, LocalDate planDate);

    /**
     * Tìm meal plans của user theo meal type
     */
    List<MealPlanEntity> findByUserIdAndMealType(Long userId, String mealType);

    /**
     * Tìm meal plans của user theo ngày và meal type
     */
    Optional<MealPlanEntity> findByUserIdAndPlanDateAndMealType(Long userId, LocalDate planDate, String mealType);

    /**
     * Tìm meal plans của user trong khoảng thời gian
     */
    List<MealPlanEntity> findByUserIdAndPlanDateBetween(Long userId, LocalDate startDate, LocalDate endDate);

    /**
     * Tìm meal plans với user và recipe
     */
    @Query("SELECT DISTINCT m FROM MealPlanEntity m " +
           "LEFT JOIN FETCH m.user " +
           "LEFT JOIN FETCH m.recipe " +
           "WHERE m.id = :id")
    Optional<MealPlanEntity> findByIdWithDetails(@Param("id") Long id);

    /**
     * Tìm meal plans của user theo recipe
     */
    List<MealPlanEntity> findByUserIdAndRecipeId(Long userId, Long recipeId);

    /**
     * Đếm meal plans trong ngày
     */
    long countByUserIdAndPlanDate(Long userId, LocalDate planDate);

    /**
     * Lấy meal plans của user với phân trang
     */
    Page<MealPlanEntity> findByUserId(Long userId, Pageable pageable);

    /**
     * Tìm meal plans trong khoảng thời gian với phân trang
     */
    @Query("SELECT m FROM MealPlanEntity m " +
           "WHERE m.user.id = :userId " +
           "AND m.planDate BETWEEN :startDate AND :endDate " +
           "ORDER BY m.planDate ASC, m.mealType ASC")
    Page<MealPlanEntity> findMealPlansByDateRange(@Param("userId") Long userId,
                                                    @Param("startDate") LocalDate startDate,
                                                    @Param("endDate") LocalDate endDate,
                                                    Pageable pageable);

    /**
     * Tìm meal plans chưa xảy ra
     */
    @Query("SELECT m FROM MealPlanEntity m " +
           "WHERE m.user.id = :userId " +
           "AND m.planDate >= CURRENT_DATE " +
           "ORDER BY m.planDate ASC")
    List<MealPlanEntity> findUpcomingMealPlans(@Param("userId") Long userId);

    /**
     * Tìm meal plans đã xảy ra
     */
    @Query("SELECT m FROM MealPlanEntity m " +
           "WHERE m.user.id = :userId " +
           "AND m.planDate < CURRENT_DATE " +
           "ORDER BY m.planDate DESC")
    List<MealPlanEntity> findPastMealPlans(@Param("userId") Long userId);
}

