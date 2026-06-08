package com.nd.dishhub.controller;

import com.nd.dishhub.DTO.request.IngredientQuantityRequest;
import com.nd.dishhub.DTO.request.RecipeRequest;
import com.nd.dishhub.DTO.request.ReviewRequest;
import com.nd.dishhub.DTO.response.RecipeResponse;
import com.nd.dishhub.DTO.response.RecipePageResponse;
import com.nd.dishhub.DTO.response.ReviewResponse;
import com.nd.dishhub.exception.UnauthorizedException;
import com.nd.dishhub.model.UserEntity;
import com.nd.dishhub.repository.UserRepository;
import com.nd.dishhub.service.FavoriteService;
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
@RequiredArgsConstructor
@RequestMapping("/api/v1/recipes")
public class RecipeController {
    private final RecipeService recipeService;
    private final RecipeSearchService recipeSearchService;
    private final ReviewService reviewService;
    private final UserRepository userRepository;
    private final FavoriteService favoriteService;
    
    private UserEntity getAuthenticatedUser(Principal principal) {
        if(principal == null) {
            throw new UnauthorizedException("You must be authenticated to perform this action");
        }
        return userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UnauthorizedException("Authenticated user not found"));
    }
    
    @PostMapping
    public ResponseEntity<RecipeResponse> create(@Valid @RequestBody RecipeRequest request, Principal principal) {
        UserEntity user = getAuthenticatedUser(principal);
        return ResponseEntity.status(HttpStatus.CREATED).body(recipeService.create(request, user.getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecipeResponse> update(@PathVariable Long id, 
                                                 @Valid @RequestBody RecipeRequest request,
                                                 Principal principal) {
        UserEntity user = getAuthenticatedUser(principal);
        RecipeResponse recipe = recipeService.getById(id);
        if(!recipe.getUserId().equals(user.getId())) {
            throw new UnauthorizedException("You don't have permission to update this recipe");
        }
        return ResponseEntity.ok(recipeService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id,
                                       Principal principal) {
        UserEntity user = getAuthenticatedUser(principal);
        RecipeResponse recipe = recipeService.getById(id);
        if (!recipe.getUserId().equals(user.getId())) {
            throw new UnauthorizedException("You don't have permission to delete this recipe");
        }
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
    public ResponseEntity<RecipePageResponse> getAll(
            @RequestParam(required = false) String userId,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            Principal principal) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<RecipeResponse> recipes;
        
        //Get my recipes
       if("me".equals(userId)) {
           if(principal == null){
               throw new UnauthorizedException("You don't have permission to access this recipe");
           }
           recipes = recipeService.getMyRecipes(principal.getName(), pageable);
       }
       else if(userId != null) {
           //Get public recipes of user
           Long targetUserId = Long.parseLong(userId);
           recipes = recipeService.getPublicRecipesByUser(targetUserId, pageable);
       }
       else {
           //Default: get all public recipes
           recipes = recipeService.getPublicRecipes(pageable);
       }
       
       // Calculate summary stats
       int totalReviews = recipes.getContent().stream()
           .mapToInt(RecipeResponse::getTotalReviews)
           .sum();
       
       Double averageRating = recipes.getContent().stream()
           .mapToDouble(r -> r.getAverageRating() != null ? r.getAverageRating() : 0)
           .average()
           .orElse(0);
       
       RecipePageResponse response = RecipePageResponse.builder()
           .page(recipes)
           .totalReviews(totalReviews)
           .averageRating(Math.round(averageRating * 10.0) / 10.0)
           .build();
       
       return ResponseEntity.ok(response);

    }

    @GetMapping("/public")
    public ResponseEntity<RecipePageResponse> getPublicRecipes(@PageableDefault(size = 10) Pageable pageable) {
        Page<RecipeResponse> recipes = recipeService.getPublicRecipes(pageable);
        
        int totalReviews = recipes.getContent().stream()
            .mapToInt(RecipeResponse::getTotalReviews)
            .sum();
        
        Double averageRating = recipes.getContent().stream()
            .mapToDouble(r -> r.getAverageRating() != null ? r.getAverageRating() : 0)
            .average()
            .orElse(0);
        
        RecipePageResponse response = RecipePageResponse.builder()
            .page(recipes)
            .totalReviews(totalReviews)
            .averageRating(Math.round(averageRating * 10.0) / 10.0)
            .build();
        
        return ResponseEntity.ok(response);
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
    public ResponseEntity<RecipePageResponse> getRecipesByCategory(
            @RequestParam String category,
            Pageable pageable) {
        Page<RecipeResponse> recipes = recipeService.getRecipesByCategory(category, pageable);
        
        int totalReviews = recipes.getContent().stream()
            .mapToInt(RecipeResponse::getTotalReviews)
            .sum();
        
        Double averageRating = recipes.getContent().stream()
            .mapToDouble(r -> r.getAverageRating() != null ? r.getAverageRating() : 0)
            .average()
            .orElse(0);
        
        RecipePageResponse response = RecipePageResponse.builder()
            .page(recipes)
            .totalReviews(totalReviews)
            .averageRating(Math.round(averageRating * 10.0) / 10.0)
            .build();
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/filter")
    public ResponseEntity<RecipePageResponse> filterRecipes(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Integer maxCalories,
            @RequestParam(required = false) String ingredients,
            Pageable pageable) {
        Page<RecipeResponse> recipes = recipeService.filterRecipes(category, maxCalories, ingredients, pageable);
        
        int totalReviews = recipes.getContent().stream()
            .mapToInt(RecipeResponse::getTotalReviews)
            .sum();
        
        Double averageRating = recipes.getContent().stream()
            .mapToDouble(r -> r.getAverageRating() != null ? r.getAverageRating() : 0)
            .average()
            .orElse(0);
        
        RecipePageResponse response = RecipePageResponse.builder()
            .page(recipes)
            .totalReviews(totalReviews)
            .averageRating(Math.round(averageRating * 10.0) / 10.0)
            .build();
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<RecipePageResponse> getRecipesByUser(@PathVariable Long userId, @PageableDefault(size = 10) Pageable pageable) {
        Page<RecipeResponse> recipes = recipeService.getPublicRecipesByUser(userId, pageable);
        
        int totalReviews = recipes.getContent().stream()
            .mapToInt(RecipeResponse::getTotalReviews)
            .sum();
        
        Double averageRating = recipes.getContent().stream()
            .mapToDouble(r -> r.getAverageRating() != null ? r.getAverageRating() : 0)
            .average()
            .orElse(0);
        
        RecipePageResponse response = RecipePageResponse.builder()
            .page(recipes)
            .totalReviews(totalReviews)
            .averageRating(Math.round(averageRating * 10.0) / 10.0)
            .build();
        
        return ResponseEntity.ok(response);
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
    public ResponseEntity<RecipePageResponse> getMyCustomRecipes(@PageableDefault(size = 10) Pageable pageable, Principal principal) {
        UserEntity user = getAuthenticatedUser(principal);
        Page<RecipeResponse> recipes = recipeService.getMyCustomRecipes(user.getId(), pageable);
        
        int totalReviews = recipes.getContent().stream()
            .mapToInt(RecipeResponse::getTotalReviews)
            .sum();
        
        Double averageRating = recipes.getContent().stream()
            .mapToDouble(r -> r.getAverageRating() != null ? r.getAverageRating() : 0)
            .average()
            .orElse(0);
        
        RecipePageResponse response = RecipePageResponse.builder()
            .page(recipes)
            .totalReviews(totalReviews)
            .averageRating(Math.round(averageRating * 10.0) / 10.0)
            .build();
        
        return ResponseEntity.ok(response);
    }

    // ==================== REVIEW ENDPOINTS ====================
    
    @GetMapping("/{id}/reviews")
    public ResponseEntity<Page<ReviewResponse>> getRecipeReviews(@PathVariable Long id, @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(reviewService.getRecipeReviews(id, pageable));
    }

    @PostMapping("/{id}/reviews")
    public ResponseEntity<ReviewResponse> createRecipeReview(
            @PathVariable Long id,
            @Valid @RequestBody ReviewRequest request,
            Principal principal) {
        UserEntity user = getAuthenticatedUser(principal);
        ReviewResponse response = reviewService.createReview(id, request, user.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ==================== IMAGE UPLOAD ENDPOINTS ====================

    @PostMapping("/upload-image")
    public ResponseEntity<Map<String, String>> uploadRecipeImage(
            @RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        
        String imageUrl = recipeService.uploadRecipeImage(file);
        return ResponseEntity.ok(Map.of("url", imageUrl));
    }

    // ==================== FAVORITE ENDPOINTS ====================

    @PostMapping("/{id}/favorite")
    public ResponseEntity<Map<String, String>> addFavorite(
            @PathVariable Long id,
            Principal principal
    ) {
       UserEntity user = getAuthenticatedUser(principal);
        favoriteService.addFavorite(user.getId(), id);
        return ResponseEntity.ok(Map.of("message", "Recipe added to favorites"));
    }

    @DeleteMapping("/{id}/favorite")
    public ResponseEntity<Map<String, String>> removeFavorite(
            @PathVariable Long id,
            Principal principal
    ) {
        UserEntity user = getAuthenticatedUser(principal);
        favoriteService.removeFavorite(user.getId(), id);
        
        return ResponseEntity.ok(Map.of("message", "Recipe removed from favorites"));
    }

    @GetMapping("/{id}/favorite")
    public ResponseEntity<Map<String, Boolean>> isFavorite(
            @PathVariable Long id,
            Principal principal
    ) {
        UserEntity user = getAuthenticatedUser(principal);
        boolean isFav = favoriteService.isFavorite(user.getId(), id);
        
        return ResponseEntity.ok(Map.of("isFavorite", isFav));
    }
}
