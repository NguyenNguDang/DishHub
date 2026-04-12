package com.nd.dishhub.DTO.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO Request để tạo/cập nhật Review
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequest {
    
    @NotNull(message = "Rating không được để trống")
    @Min(value = 1, message = "Rating phải >= 1")
    @Max(value = 5, message = "Rating phải <= 5")
    private Integer rating;
    
    private String comment;
}

