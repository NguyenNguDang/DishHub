package com.nd.dishhub.service.impl;

import com.nd.dishhub.DTO.request.CreateMealPlanRequest;
import com.nd.dishhub.DTO.response.MealPlanResponse;
import com.nd.dishhub.model.MealPlanEntity;
import com.nd.dishhub.model.RecipeEntity;
import com.nd.dishhub.model.UserEntity;
import com.nd.dishhub.repository.MealPlanRepository;
import com.nd.dishhub.repository.RecipeRepository;
import com.nd.dishhub.repository.UserRepository;
import com.nd.dishhub.service.MealPlanService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class MealPlanServiceImpl implements MealPlanService {

    private final MealPlanRepository mealPlanRepository;
    private final UserRepository userRepository;
    private final RecipeRepository recipeRepository;

    @Override
    public MealPlanResponse create(Long userId, CreateMealPlanRequest request) {
        log.info("Creating meal plan for user: {} on date: {} with meal type: {}",
                userId, request.getPlanDate(), request.getMealType());

        // Verify user exists
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Verify recipe exists
        RecipeEntity recipe = recipeRepository.findById(request.getRecipeId())
                .orElseThrow(() -> new RuntimeException("Recipe not found with id: " + request.getRecipeId()));

        // Check if meal plan already exists for this date and meal type
        mealPlanRepository.findByUserIdAndPlanDateAndMealType(
                userId, request.getPlanDate(), request.getMealType()
        ).ifPresent(existing -> {
            log.warn("Meal plan already exists for user {} on {} for {}", 
                    userId, request.getPlanDate(), request.getMealType());
            throw new RuntimeException("Meal plan already exists for this date and meal type");
        });

        // Create new meal plan
        MealPlanEntity mealPlan = MealPlanEntity.builder()
                .user(user)
                .recipe(recipe)
                .planDate(request.getPlanDate())
                .mealType(request.getMealType())
                .build();

        MealPlanEntity savedMealPlan = mealPlanRepository.save(mealPlan);
        log.info("Meal plan created successfully with id: {}", savedMealPlan.getId());

        return mapToResponse(savedMealPlan);
    }

    @Override
    @Transactional(readOnly = true)
    public MealPlanResponse getById(Long id) {
        log.info("Fetching meal plan with id: {}", id);
        MealPlanEntity mealPlan = mealPlanRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new RuntimeException("Meal plan not found with id: " + id));
        return mapToResponse(mealPlan);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MealPlanResponse> getAllByUserId(Long userId) {
        log.info("Fetching all meal plans for user: {}", userId);
        // Verify user exists
        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        List<MealPlanEntity> mealPlans = mealPlanRepository.findByUserId(userId);
        return mealPlans.stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MealPlanResponse> getMealPlansByDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        log.info("Fetching meal plans for user: {} between {} and {}", userId, startDate, endDate);
        // Verify user exists
        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        List<MealPlanEntity> mealPlans = mealPlanRepository.findByUserIdAndPlanDateBetween(userId, startDate, endDate);
        return mealPlans.stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MealPlanResponse> getMealPlansByDate(Long userId, LocalDate planDate) {
        log.info("Fetching meal plans for user: {} on date: {}", userId, planDate);
        // Verify user exists
        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        List<MealPlanEntity> mealPlans = mealPlanRepository.findByUserIdAndPlanDate(userId, planDate);
        return mealPlans.stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MealPlanResponse> getMealPlansByMealType(Long userId, String mealType) {
        log.info("Fetching meal plans for user: {} with meal type: {}", userId, mealType);
        // Verify user exists
        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        List<MealPlanEntity> mealPlans = mealPlanRepository.findByUserIdAndMealType(userId, mealType);
        return mealPlans.stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public MealPlanResponse getMealPlanByDayAndMealType(Long userId, LocalDate planDate, String mealType) {
        log.info("Fetching meal plan for user: {} on date: {} with meal type: {}", userId, planDate, mealType);
        // Verify user exists
        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        MealPlanEntity mealPlan = mealPlanRepository.findByUserIdAndPlanDateAndMealType(userId, planDate, mealType)
                .orElseThrow(() -> new RuntimeException("Meal plan not found for the specified date and meal type"));

        return mapToResponse(mealPlan);
    }

    @Override
    public void delete(Long id) {
        log.info("Deleting meal plan with id: {}", id);
        MealPlanEntity mealPlan = mealPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meal plan not found with id: " + id));

        mealPlanRepository.delete(mealPlan);
        log.info("Meal plan deleted successfully");
    }

    @Override
    public void deleteMealPlan(Long userId, LocalDate planDate, String mealType) {
        log.info("Deleting meal plan for user: {} on date: {} with meal type: {}", userId, planDate, mealType);
        // Verify user exists
        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        MealPlanEntity mealPlan = mealPlanRepository.findByUserIdAndPlanDateAndMealType(userId, planDate, mealType)
                .orElseThrow(() -> new RuntimeException("Meal plan not found for the specified date and meal type"));

        mealPlanRepository.delete(mealPlan);
        log.info("Meal plan deleted successfully");
    }

    @Override
    @Transactional(readOnly = true)
    public List<MealPlanResponse> getUpcomingMealPlans(Long userId) {
        log.info("Fetching upcoming meal plans for user: {}", userId);
        // Verify user exists
        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        List<MealPlanEntity> mealPlans = mealPlanRepository.findUpcomingMealPlans(userId);
        return mealPlans.stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MealPlanResponse> getPastMealPlans(Long userId) {
        log.info("Fetching past meal plans for user: {}", userId);
        // Verify user exists
        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        List<MealPlanEntity> mealPlans = mealPlanRepository.findPastMealPlans(userId);
        return mealPlans.stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MealPlanResponse> getMealPlansWithPagination(Long userId, Pageable pageable) {
        log.info("Fetching meal plans for user: {} with pagination", userId);
        // Verify user exists
        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Page<MealPlanEntity> mealPlans = mealPlanRepository.findByUserId(userId, pageable);
        return mealPlans.map(this::mapToResponse);
    }

    /**
     * Helper method to map MealPlanEntity to MealPlanResponse
     */
    private MealPlanResponse mapToResponse(MealPlanEntity mealPlan) {
        return MealPlanResponse.builder()
                .id(mealPlan.getId())
                .userId(mealPlan.getUser().getId())
                .recipeId(mealPlan.getRecipe().getId())
                .recipeName(mealPlan.getRecipe().getTitle())
                .recipeImage(mealPlan.getRecipe().getImageUrl())
                .planDate(mealPlan.getPlanDate())
                .mealType(mealPlan.getMealType())
                .createdAt(mealPlan.getCreatedAt())
                .updatedAt(mealPlan.getUpdatedAt())
                .build();
    }
}

