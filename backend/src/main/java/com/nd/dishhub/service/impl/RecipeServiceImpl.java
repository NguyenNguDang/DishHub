package com.nd.dishhub.service.impl;

import com.nd.dishhub.DTO.request.IngredientQuantityRequest;
import com.nd.dishhub.DTO.request.RecipeRequest;
import com.nd.dishhub.DTO.response.NutritionResponse;
import com.nd.dishhub.DTO.response.RecipeResponse;
import com.nd.dishhub.exception.RecipeNotFoundException;
import com.nd.dishhub.model.IngredientEntity;
import com.nd.dishhub.model.RecipeEntity;
import com.nd.dishhub.model.RecipeIngredientEntity;
import com.nd.dishhub.model.RecipeIngredientId;
import com.nd.dishhub.model.UserEntity;
import com.nd.dishhub.repository.IngredientRepository;
import com.nd.dishhub.repository.RecipeIngredientRepository;
import com.nd.dishhub.repository.RecipeRepository;
import com.nd.dishhub.repository.UserRepository;
import com.nd.dishhub.service.RecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class RecipeServiceImpl implements RecipeService {

    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;
    private final IngredientRepository ingredientRepository;
    private final RecipeIngredientRepository recipeIngredientRepository;

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

    @Override
    public RecipeResponse forkRecipe(Long originalId, Long userId) {
        // Verify user exists
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User with ID " + userId + " not found"));

        // Find an original recipe
        RecipeEntity originalRecipe = recipeRepository.findByIdWithIngredients(originalId)
                .orElseThrow(() -> new RecipeNotFoundException("Original recipe with ID " + originalId + " not found"));

        // Create a new recipe with is_public = false
        RecipeEntity newRecipe = RecipeEntity.builder()
                .title(originalRecipe.getTitle())
                .instructions(originalRecipe.getInstructions())
                .isPublic(false)
                .user(user)
                .parent(originalRecipe)
                .build();

        RecipeEntity savedRecipe = recipeRepository.save(newRecipe);

        // Copy all RecipeIngredients from an original recipe
        for (RecipeIngredientEntity originalIngredient : originalRecipe.getRecipeIngredients()) {
            RecipeIngredientEntity newRecipeIngredient = RecipeIngredientEntity.builder()
                    .id(new RecipeIngredientId(savedRecipe.getId(), originalIngredient.getIngredient().getId()))
                    .recipe(savedRecipe)
                    .ingredient(originalIngredient.getIngredient())
                    .quantity(originalIngredient.getQuantity())
                    .unit(originalIngredient.getUnit())
                    .build();

            recipeIngredientRepository.save(newRecipeIngredient);
        }

        // Add copied ingredients to the set
        savedRecipe.setRecipeIngredients(new HashSet<>(
                recipeIngredientRepository.findByRecipeId(savedRecipe.getId())
        ));

        // Calculate nutrition for the new recipe
        calculateNutrition(savedRecipe.getId());

        return mapToResponse(recipeRepository.findByIdWithIngredients(savedRecipe.getId()).orElse(savedRecipe));
    }

    @Override
    public RecipeResponse updateRecipeIngredients(Long recipeId, List<IngredientQuantityRequest> newIngredients) {
        RecipeEntity recipe = recipeRepository.findByIdWithIngredients(recipeId)
                .orElseThrow(() -> new RecipeNotFoundException("Recipe with ID " + recipeId + " not found"));

        // Clear existing ingredients
        recipeIngredientRepository.deleteByRecipeId(recipeId);
        recipe.getRecipeIngredients().clear();

        // Add new ingredients
        for (IngredientQuantityRequest ingredientRequest : newIngredients) {
            IngredientEntity ingredient = ingredientRepository.findById(ingredientRequest.getIngredientId())
                    .orElseThrow(() -> new RuntimeException("Ingredient with ID " + ingredientRequest.getIngredientId() + " not found"));

            RecipeIngredientEntity recipeIngredient = RecipeIngredientEntity.builder()
                    .id(new RecipeIngredientId(recipeId, ingredientRequest.getIngredientId()))
                    .recipe(recipe)
                    .ingredient(ingredient)
                    .quantity(ingredientRequest.getQuantity())
                    .unit(ingredientRequest.getUnit())
                    .build();

            recipeIngredientRepository.save(recipeIngredient);
            recipe.getRecipeIngredients().add(recipeIngredient);
        }

        RecipeEntity updatedRecipe = recipeRepository.save(recipe);

        // Trigger nutrition calculation
        calculateNutrition(recipeId);

        return mapToResponse(recipeRepository.findByIdWithIngredients(recipeId).orElse(updatedRecipe));
    }

    @Override
    public void calculateNutrition(Long recipeId) {
        RecipeEntity recipe = recipeRepository.findByIdWithIngredients(recipeId)
                .orElseThrow(() -> new RecipeNotFoundException("Recipe with ID " + recipeId + " not found"));

        double totalCalories = 0.0;
        double totalProtein;
        double totalFat = 0.0;
        double totalCarbs = 0.0;

        for (RecipeIngredientEntity recipeIngredient : recipe.getRecipeIngredients()) {
            IngredientEntity ingredient = recipeIngredient.getIngredient();
            Double quantity = recipeIngredient.getQuantity();

            // Calculate based on 100 g unit (assuming quantity is in grams)
            Double weightMultiplier = quantity / 100.0;

            totalCalories += ingredient.getCaloriesPer100g() * weightMultiplier;
            totalCarbs += ingredient.getCarb() * weightMultiplier;
            totalFat += ingredient.getFat() * weightMultiplier;
        }

        // Protein calculation (estimate: assume carbs are available, fat too, and protein = remaining macros)
        // This is a simplified formula - you might need to store protein in IngredientEntity
        totalProtein = Math.max(0, (totalCalories / 4.0) - (totalCarbs + totalFat)); // Simplified

        recipe.setTotalCalories(Math.round(totalCalories * 100.0) / 100.0);
        recipe.setTotalProtein(Math.round(totalProtein * 100.0) / 100.0);
        recipe.setTotalFat(Math.round(totalFat * 100.0) / 100.0);
        recipe.setTotalCarbs(Math.round(totalCarbs * 100.0) / 100.0);

        recipeRepository.save(recipe);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<RecipeResponse> getMyCustomRecipes(Long userId, Pageable pageable) {
        // Verify user exists
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User with ID " + userId + " not found");
        }
        return recipeRepository.findPrivateRecipesByUser(userId, pageable)
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
                .nutrition(NutritionResponse.builder()
                        .totalCalories(recipe.getTotalCalories())
                        .totalProtein(recipe.getTotalProtein())
                        .totalFat(recipe.getTotalFat())
                        .totalCarbs(recipe.getTotalCarbs())
                        .build())
                .createdAt(recipe.getCreatedAt())
                .updatedAt(recipe.getUpdatedAt())
                .build();
    }
}
