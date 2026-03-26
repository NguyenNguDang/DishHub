package com.nd.dishhub.controller;

import com.nd.dishhub.DTO.request.IngredientQuantityRequest;
import com.nd.dishhub.DTO.request.RecipeRequest;
import com.nd.dishhub.DTO.response.RecipeResponse;
import com.nd.dishhub.exception.UnauthorizedException;
import com.nd.dishhub.model.UserEntity;
import com.nd.dishhub.repository.UserRepository;
import com.nd.dishhub.service.RecipeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/recipes")
@RequiredArgsConstructor
public class RecipeController {

    private final RecipeService recipeService;
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
    public ResponseEntity<Page<RecipeResponse>> getAll(Pageable pageable) {
        try {
            Page<RecipeResponse> response = recipeService.getAll(pageable);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // If sort parameter is invalid, use default Pageable without sort
            pageable = org.springframework.data.domain.PageRequest.of(
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
            pageable = org.springframework.data.domain.PageRequest.of(
                    Math.max(pageable.getPageNumber(), 0),
                    pageable.getPageSize() > 0 ? pageable.getPageSize() : 10
            );
            Page<RecipeResponse> response = recipeService.getPublicRecipes(pageable);
            return ResponseEntity.ok(response);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<RecipeResponse>> getRecipesByUser(@PathVariable Long userId, Pageable pageable) {
        try {
            Page<RecipeResponse> response = recipeService.getRecipesByUser(userId, pageable);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            pageable = org.springframework.data.domain.PageRequest.of(
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
            pageable = org.springframework.data.domain.PageRequest.of(
                    Math.max(pageable.getPageNumber(), 0),
                    pageable.getPageSize() > 0 ? pageable.getPageSize() : 10
            );
            Page<RecipeResponse> response = recipeService.getMyCustomRecipes(user.getId(), pageable);
            return ResponseEntity.ok(response);
        }
    }
}
