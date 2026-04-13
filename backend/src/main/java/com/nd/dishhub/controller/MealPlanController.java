package com.nd.dishhub.controller;

import com.nd.dishhub.DTO.request.CreateMealPlanRequest;
import com.nd.dishhub.DTO.response.MealPlanResponse;
import com.nd.dishhub.model.UserEntity;
import com.nd.dishhub.repository.UserRepository;
import com.nd.dishhub.service.MealPlanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/meal-plans")
@RequiredArgsConstructor
public class MealPlanController {

    private final MealPlanService mealPlanService;
    private final UserRepository userRepository;

    /**
     * Create a new meal plan
     * POST /api/v1/meal-plans
     */
    @PostMapping
    public ResponseEntity<MealPlanResponse> createMealPlan(
            @Valid @RequestBody CreateMealPlanRequest request,
            Principal principal) {
        UserEntity user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        MealPlanResponse response = mealPlanService.create(user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get meal plan by ID
     * GET /api/v1/meal-plans/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<MealPlanResponse> getMealPlanById(@PathVariable Long id) {
        MealPlanResponse response = mealPlanService.getById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Get all meal plans for authenticated user
     * GET /api/v1/meal-plans
     */
    @GetMapping
    public ResponseEntity<List<MealPlanResponse>> getAllMealPlans(Principal principal) {
        UserEntity user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        List<MealPlanResponse> response = mealPlanService.getAllByUserId(user.getId());
        return ResponseEntity.ok(response);
    }

    /**
     * Get meal plans for a specific date
     * GET /api/v1/meal-plans/date/{date}
     */
    @GetMapping("/date/{date}")
    public ResponseEntity<List<MealPlanResponse>> getMealPlansByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            Principal principal) {
        UserEntity user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        List<MealPlanResponse> response = mealPlanService.getMealPlansByDate(user.getId(), date);
        return ResponseEntity.ok(response);
    }

    /**
     * Get weekly meal plans (Monday to Sunday)
     * GET /api/v1/meal-plans/weekly?date=2026-04-13
     */
    @GetMapping("/weekly")
    public ResponseEntity<List<MealPlanResponse>> getWeeklyMealPlans(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            Principal principal) {
        UserEntity user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        // If no date provided, use current date
        LocalDate referenceDate = (date != null) ? date : LocalDate.now();

        // Get Monday of the week
        LocalDate startDate = referenceDate.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        // Get Sunday of the week
        LocalDate endDate = referenceDate.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));

        List<MealPlanResponse> response = mealPlanService.getMealPlansByDateRange(
                user.getId(), startDate, endDate);
        return ResponseEntity.ok(response);
    }

    /**
     * Get meal plans for a date range
     * GET /api/v1/meal-plans/range?startDate=2026-04-07&endDate=2026-04-13
     */
    @GetMapping("/range")
    public ResponseEntity<List<MealPlanResponse>> getMealPlansByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Principal principal) {
        UserEntity user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        List<MealPlanResponse> response = mealPlanService.getMealPlansByDateRange(
                user.getId(), startDate, endDate);
        return ResponseEntity.ok(response);
    }

    /**
     * Get meal plans for a specific meal type
     * GET /api/v1/meal-plans/type/{mealType}
     */
    @GetMapping("/type/{mealType}")
    public ResponseEntity<List<MealPlanResponse>> getMealPlansByMealType(
            @PathVariable String mealType,
            Principal principal) {
        UserEntity user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        List<MealPlanResponse> response = mealPlanService.getMealPlansByMealType(user.getId(), mealType);
        return ResponseEntity.ok(response);
    }

    /**
     * Get meal plan for a specific day and meal type
     * GET /api/v1/meal-plans/day/{date}/type/{mealType}
     */
    @GetMapping("/day/{date}/type/{mealType}")
    public ResponseEntity<MealPlanResponse> getMealPlanByDayAndMealType(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @PathVariable String mealType,
            Principal principal) {
        UserEntity user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        MealPlanResponse response = mealPlanService.getMealPlanByDayAndMealType(user.getId(), date, mealType);
        return ResponseEntity.ok(response);
    }

    /**
     * Get upcoming meal plans
     * GET /api/v1/meal-plans/upcoming
     */
    @GetMapping("/upcoming")
    public ResponseEntity<List<MealPlanResponse>> getUpcomingMealPlans(Principal principal) {
        UserEntity user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        List<MealPlanResponse> response = mealPlanService.getUpcomingMealPlans(user.getId());
        return ResponseEntity.ok(response);
    }

    /**
     * Get past meal plans
     * GET /api/v1/meal-plans/past
     */
    @GetMapping("/past")
    public ResponseEntity<List<MealPlanResponse>> getPastMealPlans(Principal principal) {
        UserEntity user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        List<MealPlanResponse> response = mealPlanService.getPastMealPlans(user.getId());
        return ResponseEntity.ok(response);
    }

    /**
     * Get meal plans with pagination
     * GET /api/v1/meal-plans/paginated?page=0&size=10
     */
    @GetMapping("/paginated")
    public ResponseEntity<Page<MealPlanResponse>> getMealPlansWithPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Principal principal) {
        UserEntity user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        Pageable pageable = PageRequest.of(page, size);
        Page<MealPlanResponse> response = mealPlanService.getMealPlansWithPagination(user.getId(), pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Delete meal plan by ID
     * DELETE /api/v1/meal-plans/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteMealPlan(@PathVariable Long id) {
        mealPlanService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Meal plan deleted successfully"));
    }

    /**
     * Delete meal plan by date and meal type
     * DELETE /api/v1/meal-plans/day/{date}/type/{mealType}
     */
    @DeleteMapping("/day/{date}/type/{mealType}")
    public ResponseEntity<Map<String, String>> deleteMealPlanByDayAndType(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @PathVariable String mealType,
            Principal principal) {
        UserEntity user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        mealPlanService.deleteMealPlan(user.getId(), date, mealType);
        return ResponseEntity.ok(Map.of("message", "Meal plan deleted successfully"));
    }
}

