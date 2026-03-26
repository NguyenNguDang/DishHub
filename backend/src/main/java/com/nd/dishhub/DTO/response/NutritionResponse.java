package com.nd.dishhub.DTO.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NutritionResponse {

    private Double totalCalories;

    private Double totalProtein;

    private Double totalFat;

    private Double totalCarbs;
}

