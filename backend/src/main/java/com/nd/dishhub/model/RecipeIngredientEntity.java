package com.nd.dishhub.model;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "recipe_ingredients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecipeIngredientEntity {
    
    @EmbeddedId
    private RecipeIngredientId id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("recipeId")
    private RecipeEntity recipe;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("ingredientId")
    private IngredientEntity ingredient;
    
    @Column(name = "quantity", nullable = false)
    private Double quantity;
    
    @Column(name = "unit", nullable = false, length = 50)
    private String unit;
}

