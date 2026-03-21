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
public class IngredientResponse {

    private Long id;

    private String name;

    private Double caloriesPer100g;

    private Double carb;

    private Double fat;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}

