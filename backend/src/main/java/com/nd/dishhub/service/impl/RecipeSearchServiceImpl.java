package com.nd.dishhub.service.impl;

import com.nd.dishhub.DTO.response.RecipeResponse;
import com.nd.dishhub.model.RecipeEntity;
import com.nd.dishhub.service.RecipeSearchService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.hibernate.search.engine.search.query.SearchResult;
import org.hibernate.search.mapper.orm.Search;
import org.hibernate.search.mapper.orm.session.SearchSession;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RecipeSearchServiceImpl implements RecipeSearchService {
    @PersistenceContext
    private EntityManager entityManager;
    
    @Override
    @Transactional(readOnly = true)
    public List<RecipeResponse> searchRecipes(String keyword) {
        SearchSession searchSession = Search.session(entityManager);
        
        SearchResult<RecipeEntity> result = searchSession.search(RecipeEntity.class)
                .where(f -> f.bool()
                        .must(f.match()
                                .fields("title", "description")
                                .matching(keyword)
                                .fuzzy(1))
                        .filter(f.match().field("isPublic").matching(true)))
                .fetch(10);
        List<RecipeEntity> recipes = result.hits();
        return recipes.stream()
                .map(recipe -> RecipeResponse.builder()
                        .id(recipe.getId())
                        .title(recipe.getTitle())
                        .description(recipe.getDescription())
                        .image(recipe.getImageUrl())
                        .prepTime(recipe.getPrepTime())
                        .cookTime(recipe.getCookTime())
                        .servings(recipe.getServings())
                        .difficulty(recipe.getDifficulty())
                        .category(recipe.getCategory())
                        .tags(List.of(recipe.getTags().split(",")))
                        .instructions(List.of(recipe.getInstructions().split("\n")))
                        .isPublic(true)
                        .createdAt(recipe.getCreatedAt())
                        .updatedAt(recipe.getUpdatedAt())
                        .build())
                .toList();
    }
}
