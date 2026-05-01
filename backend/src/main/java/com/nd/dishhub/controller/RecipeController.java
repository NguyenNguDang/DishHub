package com.nd.dishhub.controller;

import com.nd.dishhub.DTO.request.IngredientQuantityRequest;
import com.nd.dishhub.DTO.request.RecipeRequest;
import com.nd.dishhub.DTO.request.ReviewRequest;
import com.nd.dishhub.DTO.response.RecipeResponse;
import com.nd.dishhub.DTO.response.ReviewResponse;
import com.nd.dishhub.exception.UnauthorizedException;
import com.nd.dishhub.model.UserEntity;
import com.nd.dishhub.repository.UserRepository;
import com.nd.dishhub.service.RecipeSearchService;
import com.nd.dishhub.service.RecipeService;
import com.nd.dishhub.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/recipes")
@RequiredArgsConstructor
public class RecipeController {
    private final RecipeService recipeService;
    private final RecipeSearchService recipeSearchService;
    private final ReviewService reviewService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<RecipeResponse> create(@Valid @RequestBody RecipeRequest request, Principal principal) {
        // Get userId from authenticated user
        UserEntity user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
        RecipeResponse response = recipeService.create(request, user.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecipeResponse> update(@PathVariable Long id, 
                                                  @Valid @RequestBody RecipeRequest request) {
        RecipeResponse response = recipeService.update(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        recipeService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecipeResponse> getById(@PathVariable Long id, Principal principal) {
        RecipeResponse response = recipeService.getById(id);
        
        // Check authorization: only return if public OR user owns it
        if (!response.getIsPublic()) {
            UserEntity authenticatedUser = userRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
            
            if (!response.getUserId().equals(authenticatedUser.getId())) {
                throw new UnauthorizedException("You don't have permission to access this recipe");
            }
        }
        
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Page<RecipeResponse>> getAll(
            @RequestParam(required = false) String userId,
            Pageable pageable,
            Principal principal) {
        try {
            // If userId=me, get current authenticated user's recipes
            if ("me".equals(userId)) {
                UserEntity user = userRepository.findByEmail(principal.getName())
                        .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
                Page<RecipeResponse> response = recipeService.getRecipesByUser(user.getId(), pageable);
                return ResponseEntity.ok(response);
            }

            // If userId is specified and is numeric, get that user's recipes
            if (userId != null) {
                try {
                    Long userIdLong = Long.parseLong(userId);
                    Page<RecipeResponse> response = recipeService.getRecipesByUser(userIdLong, pageable);
                    return ResponseEntity.ok(response);
                } catch (NumberFormatException e) {
                    throw new IllegalArgumentException("Invalid userId format");
                }
            }

            // Otherwise, get all recipes
            Page<RecipeResponse> response = recipeService.getAll(pageable);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // If sort parameter is invalid, use default Pageable without sort
            pageable = PageRequest.of(
                    Math.max(pageable.getPageNumber(), 0),
                    pageable.getPageSize() > 0 ? pageable.getPageSize() : 10
            );
            Page<RecipeResponse> response = recipeService.getAll(pageable);
            return ResponseEntity.ok(response);
        }
    }

    @GetMapping("/public")
    public ResponseEntity<Page<RecipeResponse>> getPublicRecipes(Pageable pageable) {
        try {
            Page<RecipeResponse> response = recipeService.getPublicRecipes(pageable);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            pageable = PageRequest.of(
                    Math.max(pageable.getPageNumber(), 0),
                    pageable.getPageSize() > 0 ? pageable.getPageSize() : 10
            );
            Page<RecipeResponse> response = recipeService.getPublicRecipes(pageable);
            return ResponseEntity.ok(response);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchRecipes(
            @RequestParam String keyword) {
        
        List<RecipeResponse> recipes = recipeSearchService.searchRecipes(keyword);
        Map<String, Object> response = new HashMap<>();
        response.put("content", recipes);
        return ResponseEntity.ok(response);
        
    }

    @GetMapping("/category")
    public ResponseEntity<Page<RecipeResponse>> getRecipesByCategory(
            @RequestParam String category,
            Pageable pageable) {
        try {
            Page<RecipeResponse> response = recipeService.getRecipesByCategory(category, pageable);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            pageable = PageRequest.of(
                    Math.max(pageable.getPageNumber(), 0),
                    pageable.getPageSize() > 0 ? pageable.getPageSize() : 10
            );
            Page<RecipeResponse> response = recipeService.getRecipesByCategory(category, pageable);
            return ResponseEntity.ok(response);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<RecipeResponse>> getRecipesByUser(@PathVariable Long userId, Pageable pageable) {
        try {
            Page<RecipeResponse> response = recipeService.getRecipesByUser(userId, pageable);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            pageable = PageRequest.of(
                    Math.max(pageable.getPageNumber(), 0),
                    pageable.getPageSize() > 0 ? pageable.getPageSize() : 10
            );
            Page<RecipeResponse> response = recipeService.getRecipesByUser(userId, pageable);
            return ResponseEntity.ok(response);
        }
    }

    // ==================== CUSTOM RECIPE ENDPOINTS ====================

    @PostMapping("/{id}/fork")
    public ResponseEntity<RecipeResponse> forkRecipe(@PathVariable Long id, Principal principal) {
        // Get userId from authenticated user
        UserEntity user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
        RecipeResponse response = recipeService.forkRecipe(id, user.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}/ingredients")
    public ResponseEntity<RecipeResponse> updateRecipeIngredients(@PathVariable Long id,
                                                                  @Valid @RequestBody List<IngredientQuantityRequest> newIngredients,
                                                                  Principal principal) {
        // Get userId from authenticated user
        UserEntity authenticatedUser = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        // Verify user owns this recipe
        RecipeResponse recipe = recipeService.getById(id);
        if (!recipe.getUserId().equals(authenticatedUser.getId())) {
            throw new UnauthorizedException("You don't have permission to update this recipe");
        }

        RecipeResponse response = recipeService.updateRecipeIngredients(id, newIngredients);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me/custom")
    public ResponseEntity<Page<RecipeResponse>> getMyCustomRecipes(Pageable pageable, Principal principal) {
        // Get userId from authenticated user
        UserEntity user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        try {
            Page<RecipeResponse> response = recipeService.getMyCustomRecipes(user.getId(), pageable);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            pageable = PageRequest.of(
                    Math.max(pageable.getPageNumber(), 0),
                    pageable.getPageSize() > 0 ? pageable.getPageSize() : 10
            );
            Page<RecipeResponse> response = recipeService.getMyCustomRecipes(user.getId(), pageable);
            return ResponseEntity.ok(response);
        }
    }

    // ==================== REVIEW ENDPOINTS ====================

    @GetMapping("/{id}/reviews")
    public ResponseEntity<Page<ReviewResponse>> getRecipeReviews(
            @PathVariable Long id,
            Pageable pageable) {
        try {
            Page<ReviewResponse> response = reviewService.getRecipeReviews(id, pageable);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            pageable = PageRequest.of(
                    Math.max(pageable.getPageNumber(), 0),
                    pageable.getPageSize() > 0 ? pageable.getPageSize() : 10
            );
            Page<ReviewResponse> response = reviewService.getRecipeReviews(id, pageable);
            return ResponseEntity.ok(response);
        }
    }

    @PostMapping("/{id}/reviews")
    public ResponseEntity<ReviewResponse> createRecipeReview(
            @PathVariable Long id,
            @Valid @RequestBody ReviewRequest request,
            Principal principal) {
        // Get userId from authenticated user
        UserEntity user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
        
        ReviewResponse response = reviewService.createReview(id, request, user.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ==================== IMAGE UPLOAD ENDPOINTS ====================

    @PostMapping("/upload-image")
    public ResponseEntity<Map<String, String>> uploadRecipeImage(
            @RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "File is empty"));
        }

        try {
            String imageUrl = recipeService.uploadRecipeImage(file);
            Map<String, String> response = new HashMap<>();
            response.put("url", imageUrl);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to upload image: " + e.getMessage()));
        }
    }
}
