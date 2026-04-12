package com.nd.dishhub.DTO.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecipeRequest {

    @NotBlank(message = "Recipe title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    private String image;

    private Integer prepTime;

    private Integer cookTime;

    private Integer servings;

    private String difficulty;

    private String category;

    private List<String> tags;

    private List<String> instructions;

    private Boolean isPublic = false;  // Default to false if not provided

    private Long parentId;
}

