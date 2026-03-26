package com.nd.dishhub.repository;

import com.nd.dishhub.model.RecipeIngredientEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecipeIngredientRepository extends JpaRepository<RecipeIngredientEntity, Long> {

    /**
     * Tìm tất cả RecipeIngredient của một recipe
     */
    List<RecipeIngredientEntity> findByRecipeId(Long recipeId);

    /**
     * Xóa tất cả RecipeIngredient của một recipe
     */
    @Modifying
    @Query("DELETE FROM RecipeIngredientEntity ri WHERE ri.recipe.id = :recipeId")
    void deleteByRecipeId(@Param("recipeId") Long recipeId);
}
