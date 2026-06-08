package com.nd.dishhub.repository;

import com.nd.dishhub.model.RecipeEntity;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class RecipeSpecification {
    public static Specification<RecipeEntity> filter(String category, Integer maxCalories, String ingredients) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            //Mặc định chỉ lấy công thức public
            predicates.add(cb.isTrue(root.get("isPublic")));
            
            // Filter Category
            if (category != null && !category.isEmpty() && !"All".equals(category)) {
                predicates.add(cb.equal(root.get("category"), category));
            }
            // Filter Calories (Join bảng Nutrition)
            if (maxCalories != null && maxCalories > 0) {
                Join<Object, Object> nutritionJoin = root.join("nutrition", JoinType.LEFT);
                predicates.add(cb.lessThanOrEqualTo(nutritionJoin.get("totalCalories"), maxCalories));
            }
            
            // Filter Ingredients (title and description)
            if (ingredients != null && !ingredients.isEmpty()) {
                String[] list = ingredients.split(",");
                List<Predicate> keywordPredicates = new ArrayList<>();
                for (String ingredient : list) {
                    String pattern = "%" + ingredient.trim() + "%";
                    keywordPredicates.add(cb.or(
                            cb.like(cb.lower(root.get("title")), pattern),
                            cb.like(cb.lower(root.get("description")), pattern)
                    ));
                }
                predicates.add(cb.or(keywordPredicates.toArray(new Predicate[0])));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
    
}
