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
public class RecipeResponse {

    private Long id;

    private String title;

    private String instructions;

    private Boolean isPublic;

    private Long userId;

    private Long parentId;

    private NutritionResponse nutrition;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}

