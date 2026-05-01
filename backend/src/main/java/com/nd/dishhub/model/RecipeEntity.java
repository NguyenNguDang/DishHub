package com.nd.dishhub.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.FullTextField;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.GenericField;
import org.hibernate.search.mapper.pojo.mapping.definition.annotation.Indexed;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@Builder
@Indexed
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "recipes")
public class RecipeEntity extends AbstractEntity<Long> {
    
    @Column(name = "title", nullable = false, length = 255)
    @FullTextField(analyzer = "standard")
    private String title;
    
    @Column(name = "description", length = 500)
    @FullTextField(analyzer = "standard")
    private String description;
    
    @Column(name = "category")
    private String category;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @Column(name = "prep_time")
    private Integer prepTime;
    
    @Column(name = "cook_time")
    private Integer cookTime;
    
    @Column(name = "servings")
    private Integer servings;
    
    @Column(name = "difficulty")
    private String difficulty;
    
    @Column(name = "tags")
    private String tags;
    
    @Column(name = "instructions", columnDefinition = "TEXT")
    private String instructions;
    
    @Column(name = "is_public", nullable = false)
    @GenericField
    private Boolean isPublic = false;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private RecipeEntity parent;
    
    @OneToMany(mappedBy = "parent")
    private Set<RecipeEntity> variations = new HashSet<>();
    
    @OneToMany(mappedBy = "recipe")
    private Set<RecipeIngredientEntity> recipeIngredients = new HashSet<>();
    
    @OneToMany(mappedBy = "recipe")
    private Set<MealPlanEntity> mealPlans = new HashSet<>();
    
    @OneToMany(mappedBy = "recipe")
    private Set<ReviewEntity> reviews = new HashSet<>();

    @Column(name = "total_calories", nullable = true)
    private Double totalCalories;

    @Column(name = "total_protein", nullable = true)
    private Double totalProtein;

    @Column(name = "total_fat", nullable = true)
    private Double totalFat;

    @Column(name = "total_carbs", nullable = true)
    private Double totalCarbs;
}
