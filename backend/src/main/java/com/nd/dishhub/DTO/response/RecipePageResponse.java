package com.nd.dishhub.DTO.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecipePageResponse {
    private Page<RecipeResponse> page;
    private int totalReviews;
    private Double averageRating;
}

