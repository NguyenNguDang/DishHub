package com.nd.dishhub.DTO.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateShoppingListItemRequest {
    
    private String name;
    private Double quantity;
    private String unit;
    private String category;
    private Boolean isChecked;
}

