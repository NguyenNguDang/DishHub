package com.nd.dishhub.service;

import com.nd.dishhub.DTO.request.ReviewRequest;
import com.nd.dishhub.DTO.response.ReviewResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service interface cho Review management
 */
public interface ReviewService {
    
    /**
     * Lấy reviews của recipe
     */
    Page<ReviewResponse> getRecipeReviews(Long recipeId, Pageable pageable);
    
    /**
     * Lấy review chi tiết
     */
    ReviewResponse getReviewById(Long reviewId);
    
    /**
     * Tạo review mới
     */
    ReviewResponse createReview(Long recipeId, ReviewRequest request, Long userId);
    
    /**
     * Cập nhật review
     */
    ReviewResponse updateReview(Long reviewId, ReviewRequest request, Long userId);
    
    /**
     * Xóa review
     */
    void deleteReview(Long reviewId, Long userId);
    
    /**
     * Lấy rating trung bình của recipe
     */
    Double getAverageRating(Long recipeId);
    
    /**
     * Đếm số reviews của recipe
     */
    long getReviewCount(Long recipeId);
}

