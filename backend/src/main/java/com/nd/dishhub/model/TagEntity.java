package com.nd.dishhub.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "tags")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TagEntity extends AbstractEntity<Long> {
    
    @Column(name = "name", nullable = false, unique = true, length = 100)
    private String name;
    
    @ManyToMany(mappedBy = "tags")
    private Set<RecipeEntity> recipes = new HashSet<>();
}

