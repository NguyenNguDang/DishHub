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

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "shopping_lists")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShoppingListEntity extends AbstractEntity<Long> {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;
    
    @Column(name = "week_start", nullable = false)
    private LocalDate weekStart;
    
    @OneToMany(mappedBy = "shoppingList", cascade = jakarta.persistence.CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<ShoppingListItemEntity> items = new HashSet<>();
}



