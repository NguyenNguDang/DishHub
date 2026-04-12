package com.nd.dishhub.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "shopping_list_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShoppingListItemEntity extends AbstractEntity<Long> {
    
    @Column(name = "name", nullable = false, length = 255)
    private String name;
    
    @Column(name = "quantity", nullable = false)
    private Double quantity;
    
    @Column(name = "unit", length = 50)
    private String unit;
    
    @Column(name = "category", length = 100)
    private String category;
    
    @Column(name = "is_checked", nullable = false)
    private Boolean isChecked = false;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shopping_list_id", nullable = false)
    private ShoppingListEntity shoppingList;
}

