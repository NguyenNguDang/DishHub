package com.nd.dishhub.model;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * FavoriteEntity - Represent a favorite recipe for a user
 * Composite unique key on (user_id, recipe_id) to prevent duplicates
 */
@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(
    name = "favorites",
    uniqueConstraints = @UniqueConstraint(
        columnNames = {"user_id", "recipe_id"},
        name = "uk_user_recipe_favorite"
    )
)
public class FavoriteEntity extends AbstractEntity<Long> {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false)
    private RecipeEntity recipe;
}

