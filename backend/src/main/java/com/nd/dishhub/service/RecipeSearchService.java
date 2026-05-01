package com.nd.dishhub.service;

import com.nd.dishhub.DTO.response.RecipeResponse;
import org.springframework.stereotype.Service;

import java.util.List;

public interface RecipeSearchService {
    List<RecipeResponse> searchRecipes(String keyword);
}
