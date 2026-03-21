package com.nd.dishhub.DTO.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IngredientRequest {

    @NotBlank(message = "Ingredient name is required")
    private String name;

    @NotNull(message = "Calories per 100g is required")
    @Min(value = 0, message = "Calories must be greater than or equal to 0")
    private Double caloriesPer100g;

    @NotNull(message = "Carbohydrates is required")
    @Min(value = 0, message = "Carbohydrates must be greater than or equal to 0")
    private Double carb;

    @NotNull(message = "Fat is required")
    @Min(value = 0, message = "Fat must be greater than or equal to 0")
    private Double fat;
}

