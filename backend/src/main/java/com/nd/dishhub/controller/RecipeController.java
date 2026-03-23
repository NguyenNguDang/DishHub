package com.nd.dishhub.controller;

import com.nd.dishhub.DTO.request.RecipeRequest;
import com.nd.dishhub.DTO.response.RecipeResponse;
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
    public ResponseEntity<RecipeResponse> getById(@PathVariable Long id) {
        RecipeResponse response = recipeService.getById(id);
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
}

