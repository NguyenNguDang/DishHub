package com.nd.dishhub.DTO.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecipeIngredientResponse {

    private Long id;

    private String name;

    private Double quantity;

    private String unit;
}

