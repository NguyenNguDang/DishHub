package com.nd.dishhub.DTO.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MealPlanResponse {

    private Long id;

    private Long userId;

    private Long recipeId;

    private String recipeName;

    private String recipeImage;

    private LocalDate planDate;

    private String mealType;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}

