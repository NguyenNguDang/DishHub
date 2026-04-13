package com.nd.dishhub.service;

import com.nd.dishhub.DTO.request.CreateMealPlanRequest;
import com.nd.dishhub.DTO.response.MealPlanResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface MealPlanService {

    /**
     * Create a new meal plan for a user
     */
    MealPlanResponse create(Long userId, CreateMealPlanRequest request);

    /**
     * Get meal plan by ID
     */
    MealPlanResponse getById(Long id);

    /**
     * Get all meal plans for a user
     */
    List<MealPlanResponse> getAllByUserId(Long userId);

    /**
     * Get meal plans for a user for a specific date range (weekly)
     */
    List<MealPlanResponse> getMealPlansByDateRange(Long userId, LocalDate startDate, LocalDate endDate);

    /**
     * Get meal plans for a user for a specific date
     */
    List<MealPlanResponse> getMealPlansByDate(Long userId, LocalDate planDate);

    /**
     * Get meal plans for a user for a specific meal type
     */
    List<MealPlanResponse> getMealPlansByMealType(Long userId, String mealType);

    /**
     * Get meal plan for a specific day and meal type
     */
    MealPlanResponse getMealPlanByDayAndMealType(Long userId, LocalDate planDate, String mealType);

    /**
     * Delete a meal plan
     */
    void delete(Long id);

    /**
     * Delete meal plan by userId, date, and meal type
     */
    void deleteMealPlan(Long userId, LocalDate planDate, String mealType);

    /**
     * Get upcoming meal plans for a user
     */
    List<MealPlanResponse> getUpcomingMealPlans(Long userId);

    /**
     * Get past meal plans for a user
     */
    List<MealPlanResponse> getPastMealPlans(Long userId);

    /**
     * Get meal plans with pagination
     */
    Page<MealPlanResponse> getMealPlansWithPagination(Long userId, Pageable pageable);
}

