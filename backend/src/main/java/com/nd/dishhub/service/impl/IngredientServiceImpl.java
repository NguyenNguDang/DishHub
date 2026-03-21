package com.nd.dishhub.service.impl;

import com.nd.dishhub.DTO.request.IngredientRequest;
import com.nd.dishhub.DTO.response.IngredientResponse;
import com.nd.dishhub.model.IngredientEntity;
import com.nd.dishhub.repository.IngredientRepository;
import com.nd.dishhub.service.IngredientService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class IngredientServiceImpl implements IngredientService {

    private final IngredientRepository ingredientRepository;

    @Override
    public IngredientResponse create(IngredientRequest request) {
        if (ingredientRepository.existsByName(request.getName())) {
            throw new RuntimeException("Ingredient with name '" + request.getName() + "' already exists");
        }

        IngredientEntity ingredient = IngredientEntity.builder()
                .name(request.getName())
                .caloriesPer100g(request.getCaloriesPer100g())
                .carb(request.getCarb())
                .fat(request.getFat())
                .build();

        IngredientEntity savedIngredient = ingredientRepository.save(ingredient);
        return mapToResponse(savedIngredient);
    }

    @Override
    public IngredientResponse update(Long id, IngredientRequest request) {
        IngredientEntity ingredient = ingredientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ingredient with ID " + id + " not found"));

        if (!ingredient.getName().equals(request.getName()) && 
            ingredientRepository.existsByName(request.getName())) {
            throw new RuntimeException("Ingredient with name '" + request.getName() + "' already exists");
        }

        ingredient.setName(request.getName());
        ingredient.setCaloriesPer100g(request.getCaloriesPer100g());
        ingredient.setCarb(request.getCarb());
        ingredient.setFat(request.getFat());

        IngredientEntity updatedIngredient = ingredientRepository.save(ingredient);
        return mapToResponse(updatedIngredient);
    }

    @Override
    public void delete(Long id) {
        if (!ingredientRepository.existsById(id)) {
            throw new RuntimeException("Ingredient with ID " + id + " not found");
        }
        ingredientRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public IngredientResponse getById(Long id) {
        IngredientEntity ingredient = ingredientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ingredient with ID " + id + " not found"));
        return mapToResponse(ingredient);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<IngredientResponse> getAll(Pageable pageable) {
        return ingredientRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    private IngredientResponse mapToResponse(IngredientEntity ingredient) {
        return IngredientResponse.builder()
                .id(ingredient.getId())
                .name(ingredient.getName())
                .caloriesPer100g(ingredient.getCaloriesPer100g())
                .carb(ingredient.getCarb())
                .fat(ingredient.getFat())
                .createdAt(ingredient.getCreatedAt())
                .updatedAt(ingredient.getUpdatedAt())
                .build();
    }
}

