package com.nd.dishhub.DTO.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShoppingListItemResponse {
    
    private Long id;
    private String name;
    private Double quantity;
    private String unit;
    private String category;
    private Boolean isChecked;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

