package com.nd.dishhub.service.impl;

import com.nd.dishhub.DTO.request.ReviewRequest;
import com.nd.dishhub.DTO.response.ReviewResponse;
import com.nd.dishhub.exception.UnauthorizedException;
import com.nd.dishhub.model.RecipeEntity;
import com.nd.dishhub.model.ReviewEntity;
import com.nd.dishhub.model.UserEntity;
import com.nd.dishhub.repository.RecipeRepository;
import com.nd.dishhub.repository.ReviewRepository;
import com.nd.dishhub.repository.UserRepository;
import com.nd.dishhub.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementation của ReviewService
 */
@Service
@RequiredArgsConstructor
@Transactional
public class ReviewServiceImpl implements ReviewService {
    
    private final ReviewRepository reviewRepository;
    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;
    
    @Override
    @Transactional(readOnly = true)
    public Page<ReviewResponse> getRecipeReviews(Long recipeId, Pageable pageable) {
        // Verify recipe exists
        if (!recipeRepository.existsById(recipeId)) {
            throw new RuntimeException("Recipe not found");
        }
        return reviewRepository.findByRecipeIdOrderByRating(recipeId, pageable)
                .map(this::mapToResponse);
    }
    
    @Override
    @Transactional(readOnly = true)
    public ReviewResponse getReviewById(Long reviewId) {
        ReviewEntity review = reviewRepository.findByIdWithDetails(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        return mapToResponse(review);
    }
    
    @Override
    public ReviewResponse createReview(Long recipeId, ReviewRequest request, Long userId) {
        // Verify user exists
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Verify recipe exists
        RecipeEntity recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));
        
        // Check if user already reviewed this recipe
        if (reviewRepository.existsByUserIdAndRecipeId(userId, recipeId)) {
            throw new RuntimeException("You have already reviewed this recipe");
        }
        
        // Create review
        ReviewEntity review = ReviewEntity.builder()
                .user(user)
                .recipe(recipe)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();
        
        ReviewEntity savedReview = reviewRepository.save(review);
        return mapToResponse(savedReview);
    }
    
    @Override
    public ReviewResponse updateReview(Long reviewId, ReviewRequest request, Long userId) {
        ReviewEntity review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        
        // Check authorization
        if (!review.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You don't have permission to update this review");
        }
        
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        
        ReviewEntity updatedReview = reviewRepository.save(review);
        return mapToResponse(updatedReview);
    }
    
    @Override
    public void deleteReview(Long reviewId, Long userId) {
        ReviewEntity review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        
        // Check authorization
        if (!review.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You don't have permission to delete this review");
        }
        
        reviewRepository.deleteById(reviewId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Double getAverageRating(Long recipeId) {
        return reviewRepository.findAverageRatingByRecipeId(recipeId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public long getReviewCount(Long recipeId) {
        return reviewRepository.countByRecipeId(recipeId);
    }
    
    private ReviewResponse mapToResponse(ReviewEntity review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .userId(review.getUser().getId())
                .userAvatar(review.getUser().getAvatarUrl())
                .recipeId(review.getRecipe().getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }
}

