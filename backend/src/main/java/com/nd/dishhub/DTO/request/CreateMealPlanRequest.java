package com.nd.dishhub.DTO.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateMealPlanRequest {

    @NotNull(message = "Recipe ID is required")
    private Long recipeId;

    @NotNull(message = "Plan date is required")
    private LocalDate planDate;

    @NotBlank(message = "Meal type is required (breakfast, lunch, dinner, snack)")
    private String mealType;
}

