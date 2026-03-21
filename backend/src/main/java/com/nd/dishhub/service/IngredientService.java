package com.nd.dishhub.service;

import com.nd.dishhub.DTO.request.IngredientRequest;
import com.nd.dishhub.DTO.response.IngredientResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IngredientService {

    IngredientResponse create(IngredientRequest request);

    IngredientResponse update(Long id, IngredientRequest request);

    void delete(Long id);

    IngredientResponse getById(Long id);

    Page<IngredientResponse> getAll(Pageable pageable);
}

