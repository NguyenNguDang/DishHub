package com.nd.dishhub.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class RecipeIngredientId implements Serializable {
    
    @Column(name = "recipe_id")
    private Long recipeId;
    
    @Column(name = "ingredient_id")
    private Long ingredientId;
}

