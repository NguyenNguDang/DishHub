package com.nd.dishhub.controller;

import com.nd.dishhub.DTO.request.IngredientRequest;
import com.nd.dishhub.DTO.response.IngredientResponse;
import com.nd.dishhub.service.IngredientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ingredients")
@RequiredArgsConstructor
public class IngredientController {

    private final IngredientService ingredientService;

    @PostMapping
    public ResponseEntity<IngredientResponse> create(@Valid @RequestBody IngredientRequest request) {
        IngredientResponse response = ingredientService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<IngredientResponse> update(@PathVariable Long id, 
                                                      @Valid @RequestBody IngredientRequest request) {
        IngredientResponse response = ingredientService.update(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        ingredientService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<IngredientResponse> getById(@PathVariable Long id) {
        IngredientResponse response = ingredientService.getById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Page<IngredientResponse>> getAll(Pageable pageable) {
        try {
            Page<IngredientResponse> response = ingredientService.getAll(pageable);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // If sort parameter is invalid, use default Pageable without sort
            pageable = org.springframework.data.domain.PageRequest.of(
                    Math.max(pageable.getPageNumber(), 0),
                    pageable.getPageSize() > 0 ? pageable.getPageSize() : 10
            );
            Page<IngredientResponse> response = ingredientService.getAll(pageable);
            return ResponseEntity.ok(response);
        }
    }
}

