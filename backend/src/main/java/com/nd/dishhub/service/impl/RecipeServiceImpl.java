package com.nd.dishhub.service.impl;

import com.nd.dishhub.DTO.request.RecipeRequest;
import com.nd.dishhub.DTO.response.RecipeResponse;
import com.nd.dishhub.model.RecipeEntity;
import com.nd.dishhub.model.UserEntity;
import com.nd.dishhub.repository.RecipeRepository;
import com.nd.dishhub.repository.UserRepository;
import com.nd.dishhub.service.RecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class RecipeServiceImpl implements RecipeService {

    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;

    @Override
    public RecipeResponse create(RecipeRequest request, Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User with ID " + userId + " not found"));

        RecipeEntity parent = null;
        if (request.getParentId() != null) {
            parent = recipeRepository.findById(request.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent recipe with ID " + request.getParentId() + " not found"));
        }

        RecipeEntity recipe = RecipeEntity.builder()
                .title(request.getTitle())
                .instructions(request.getInstructions())
                .isPublic(request.getIsPublic())
                .user(user)
                .parent(parent)
                .build();

        RecipeEntity savedRecipe = recipeRepository.save(recipe);
        return mapToResponse(savedRecipe);
    }

    @Override
    public RecipeResponse update(Long id, RecipeRequest request) {
        RecipeEntity recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recipe with ID " + id + " not found"));

        recipe.setTitle(request.getTitle());
        recipe.setInstructions(request.getInstructions());
        recipe.setIsPublic(request.getIsPublic());

        if (request.getParentId() != null && !request.getParentId().equals(recipe.getParent() != null ? recipe.getParent().getId() : null)) {
            RecipeEntity parent = recipeRepository.findById(request.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent recipe with ID " + request.getParentId() + " not found"));
            recipe.setParent(parent);
        }

        RecipeEntity updatedRecipe = recipeRepository.save(recipe);
        return mapToResponse(updatedRecipe);
    }

    @Override
    public void delete(Long id) {
        if (!recipeRepository.existsById(id)) {
            throw new RuntimeException("Recipe with ID " + id + " not found");
        }
        recipeRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public RecipeResponse getById(Long id) {
        RecipeEntity recipe = recipeRepository.findByIdWithAllRelationships(id)
                .orElseThrow(() -> new RuntimeException("Recipe with ID " + id + " not found"));
        return mapToResponse(recipe);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<RecipeResponse> getAll(Pageable pageable) {
        return recipeRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<RecipeResponse> getPublicRecipes(Pageable pageable) {
        return recipeRepository.findByIsPublicTrue(pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<RecipeResponse> getRecipesByUser(Long userId, Pageable pageable) {
        // Verify user exists
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User with ID " + userId + " not found");
        }
        return recipeRepository.findByUserId(userId, pageable)
                .map(this::mapToResponse);
    }

    private RecipeResponse mapToResponse(RecipeEntity recipe) {
        return RecipeResponse.builder()
                .id(recipe.getId())
                .title(recipe.getTitle())
                .instructions(recipe.getInstructions())
                .isPublic(recipe.getIsPublic())
                .userId(recipe.getUser() != null ? recipe.getUser().getId() : null)
                .parentId(recipe.getParent() != null ? recipe.getParent().getId() : null)
                .createdAt(recipe.getCreatedAt())
                .updatedAt(recipe.getUpdatedAt())
                .build();
    }
}

