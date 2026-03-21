package com.nd.dishhub.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "ingredients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IngredientEntity extends AbstractEntity<Long> {
    
    @Column(name = "name", nullable = false, unique = true, length = 100)
    private String name;
    
    @Column(name = "calories_per_100g", nullable = false)
    private Double caloriesPer100g;
    
    @Column(name = "carb", nullable = false)
    private Double carb;
    
    @Column(name = "fat", nullable = false)
    private Double fat;
    
    @OneToMany(mappedBy = "ingredient")
    private Set<RecipeIngredientEntity> recipeIngredients = new HashSet<>();
}

