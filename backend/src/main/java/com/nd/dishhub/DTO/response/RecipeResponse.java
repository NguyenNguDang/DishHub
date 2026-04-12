package com.nd.dishhub.DTO.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecipeResponse {

    private Long id;

    private String title;

    private String description;

    private String image;

    private Integer prepTime;

    private Integer cookTime;

    private Integer servings;

    private String difficulty;

    private String category;

    private List<String> tags;

    private List<String> instructions;

    private Boolean isPublic;

    private Long userId;

    private Long parentId;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}

