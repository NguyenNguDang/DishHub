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
import com.nd.dishhub.service.FileUploadService;
import com.nd.dishhub.service.RecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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
    private final FileUploadService fileUploadService;

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
                .description(request.getDescription())
                .imageUrl(request.getImage())
                .prepTime(request.getPrepTime() != null ? request.getPrepTime() : 0)
                .cookTime(request.getCookTime() != null ? request.getCookTime() : 0)
                .servings(request.getServings() != null ? request.getServings() : 1)
                .difficulty(request.getDifficulty() != null ? request.getDifficulty() : "medium")
                .category(request.getCategory())
                .tags(request.getTags() != null ? String.join(",", request.getTags()) : "")
                .instructions(request.getInstructions() != null ? String.join("|", request.getInstructions()) : "")
                .isPublic(request.getIsPublic() != null ? request.getIsPublic() : false)
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
        recipe.setDescription(request.getDescription());
        recipe.setImageUrl(request.getImage());
        recipe.setPrepTime(request.getPrepTime() != null ? request.getPrepTime() : recipe.getPrepTime());
        recipe.setCookTime(request.getCookTime() != null ? request.getCookTime() : recipe.getCookTime());
        recipe.setServings(request.getServings() != null ? request.getServings() : recipe.getServings());
        recipe.setDifficulty(request.getDifficulty() != null ? request.getDifficulty() : recipe.getDifficulty());
        recipe.setCategory(request.getCategory() != null ? request.getCategory() : recipe.getCategory());
        if (request.getTags() != null) {
            recipe.setTags(String.join(",", request.getTags()));
        }
        if (request.getInstructions() != null) {
             recipe.setInstructions(String.join("|", request.getInstructions()));
         }
         if (request.getIsPublic() != null) {
             recipe.setIsPublic(request.getIsPublic());
         }

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

    @Override
    public Page<RecipeResponse> searchRecipes(String query, Pageable pageable) {
        return recipeRepository.searchPublicRecipes(query, pageable)
                .map(this::mapToResponse);
    }

    @Override
    public Page<RecipeResponse> getRecipesByCategory(String category, Pageable pageable) {
        return recipeRepository.findPublicRecipesByCategory(category, pageable)
                .map(this::mapToResponse);
    }

    @Override
    public String uploadRecipeImage(MultipartFile file) throws IOException {
        return fileUploadService.uploadFile(file);
    }

    private RecipeResponse mapToResponse(RecipeEntity recipe) {
        List<String> tags = recipe.getTags() != null && !recipe.getTags().isEmpty() 
            ? List.of(recipe.getTags().split(",")) 
            : List.of();
        
        List<String> instructions = recipe.getInstructions() != null && !recipe.getInstructions().isEmpty()
            ? List.of(recipe.getInstructions().split("\\|"))
            : List.of();
            
        return RecipeResponse.builder()
                .id(recipe.getId())
                .title(recipe.getTitle())
                .description(recipe.getDescription())
                .image(recipe.getImageUrl())
                .prepTime(recipe.getPrepTime())
                .cookTime(recipe.getCookTime())
                .servings(recipe.getServings())
                .difficulty(recipe.getDifficulty())
                .category(recipe.getCategory())
                .tags(tags)
                .instructions(instructions)
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
