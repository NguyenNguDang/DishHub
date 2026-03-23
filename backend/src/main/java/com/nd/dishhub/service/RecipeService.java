package com.nd.dishhub.service;

import com.nd.dishhub.DTO.request.RecipeRequest;
import com.nd.dishhub.DTO.response.RecipeResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RecipeService {

    RecipeResponse create(RecipeRequest request, Long userId);

    RecipeResponse update(Long id, RecipeRequest request);

    void delete(Long id);

    RecipeResponse getById(Long id);

    Page<RecipeResponse> getAll(Pageable pageable);

    Page<RecipeResponse> getPublicRecipes(Pageable pageable);

    Page<RecipeResponse> getRecipesByUser(Long userId, Pageable pageable);
}

