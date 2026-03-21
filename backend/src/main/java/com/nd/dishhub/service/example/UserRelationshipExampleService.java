package com.nd.dishhub.service.example;

import com.nd.dishhub.model.*;
import com.nd.dishhub.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Set;

/**
 * Ví dụ sử dụng Relationships trong Service Layer
 * 
 * LƯU Ý: Đây chỉ là ví dụ minh họa, không phải code production.
 * Hãy sử dụng trong các service thực tế của bạn.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class UserRelationshipExampleService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RecipeRepository recipeRepository;
    private final MealPlanRepository mealPlanRepository;
    private final ReviewRepository reviewRepository;

    // ============================================================================
    // 1. EXAMPLES: User - Role Relationships (Many-to-Many)
    // ============================================================================

    /**
     * Ví dụ 1: Gán role cho user
     */
    public void assignRoleToUser(Long userId, String roleName) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        RoleEntity role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        
        user.getRoles().add(role);
        userRepository.save(user);
    }

    /**
     * Ví dụ 2: Xóa role khỏi user
     */
    public void removeRoleFromUser(Long userId, String roleName) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        RoleEntity role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        
        user.getRoles().remove(role);
        userRepository.save(user);
    }

    /**
     * Ví dụ 3: Kiểm tra user có role nào đó không
     */
    public boolean userHasRole(Long userId, String roleName) {
        UserEntity user = userRepository.findByIdWithRoles(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return user.getRoles().stream()
                .anyMatch(role -> role.getName().equals(roleName));
    }

    /**
     * Ví dụ 4: Lấy tất cả users với role "ADMIN"
     */
    public long countAdminUsers() {
        return userRepository.countUsersByRoleName("ADMIN");
    }

    /**
     * Ví dụ 5: Gán nhiều roles cho user cùng lúc
     */
    public void assignMultipleRolesToUser(Long userId, Set<String> roleNames) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        roleNames.forEach(roleName -> {
            RoleEntity role = roleRepository.findByName(roleName)
                    .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
            user.getRoles().add(role);
        });
        
        userRepository.save(user);
    }

    // ============================================================================
    // 2. EXAMPLES: User - Recipe Relationships (One-to-Many)
    // ============================================================================

    /**
     * Ví dụ 6: Tạo recipe cho user
     */
    public void createRecipeForUser(Long userId, String title, String instructions) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        RecipeEntity recipe = RecipeEntity.builder()
                .title(title)
                .instructions(instructions)
                .user(user)
                .isPublic(false)
                .build();
        
        user.getRecipes().add(recipe);
        userRepository.save(user);
    }

    /**
     * Ví dụ 7: Đếm số recipes của user
     */
    public int getRecipeCountForUser(Long userId) {
        UserEntity user = userRepository.findByIdWithRecipes(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return user.getRecipes().size();
    }

    /**
     * Ví dụ 8: Lấy tất cả public recipes của user
     */
    public Set<RecipeEntity> getUserPublicRecipes(Long userId) {
        UserEntity user = userRepository.findByIdWithRecipes(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return user.getRecipes().stream()
                .filter(RecipeEntity::getIsPublic)
                .collect(java.util.stream.Collectors.toSet());
    }

    /**
     * Ví dụ 9: Xóa recipe của user
     */
    public void deleteUserRecipe(Long userId, Long recipeId) {
        UserEntity user = userRepository.findByIdWithRecipes(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.getRecipes().removeIf(recipe -> recipe.getId().equals(recipeId));
        userRepository.save(user);
    }

    // ============================================================================
    // 3. EXAMPLES: User - MealPlan Relationships (One-to-Many)
    // ============================================================================

    /**
     * Ví dụ 10: Tạo meal plan cho user
     */
    public void createMealPlanForUser(Long userId, Long recipeId, LocalDate planDate, String mealType) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        RecipeEntity recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));
        
        MealPlanEntity mealPlan = MealPlanEntity.builder()
                .user(user)
                .recipe(recipe)
                .planDate(planDate)
                .mealType(mealType)
                .build();
        
        user.getMealPlans().add(mealPlan);
        userRepository.save(user);
    }

    /**
     * Ví dụ 11: Lấy meal plans của user hôm nay
     */
    public Set<MealPlanEntity> getTodayMealPlans(Long userId) {
        UserEntity user = userRepository.findByIdWithMealPlans(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return user.getMealPlans().stream()
                .filter(mp -> mp.getPlanDate().equals(LocalDate.now()))
                .collect(java.util.stream.Collectors.toSet());
    }

    /**
     * Ví dụ 12: Đếm meal plans của user
     */
    public int getMealPlanCountForUser(Long userId) {
        UserEntity user = userRepository.findByIdWithMealPlans(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return user.getMealPlans().size();
    }

    /**
     * Ví dụ 13: Xóa meal plan của user
     */
    public void deleteMealPlan(Long userId, Long mealPlanId) {
        UserEntity user = userRepository.findByIdWithMealPlans(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.getMealPlans().removeIf(mp -> mp.getId().equals(mealPlanId));
        userRepository.save(user);
    }

    // ============================================================================
    // 4. EXAMPLES: User - Review Relationships (One-to-Many)
    // ============================================================================

    /**
     * Ví dụ 14: Tạo review cho user
     */
    public void createReviewForUser(Long userId, Long recipeId, Integer rating, String comment) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        RecipeEntity recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));
        
        // Kiểm tra xem user đã review recipe này chưa
        if (reviewRepository.existsByUserIdAndRecipeId(userId, recipeId)) {
            throw new RuntimeException("User already reviewed this recipe");
        }
        
        ReviewEntity review = ReviewEntity.builder()
                .user(user)
                .recipe(recipe)
                .rating(rating)
                .comment(comment)
                .build();
        
        user.getReviews().add(review);
        userRepository.save(user);
    }

    /**
     * Ví dụ 15: Lấy tất cả reviews của user
     */
    public Set<ReviewEntity> getUserReviews(Long userId) {
        UserEntity user = userRepository.findByIdWithReviews(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return user.getReviews();
    }

    /**
     * Ví dụ 16: Lấy reviews 5 sao của user
     */
    public Set<ReviewEntity> getUserFiveStarReviews(Long userId) {
        UserEntity user = userRepository.findByIdWithReviews(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return user.getReviews().stream()
                .filter(review -> review.getRating() == 5)
                .collect(java.util.stream.Collectors.toSet());
    }

    /**
     * Ví dụ 17: Xóa review của user
     */
    public void deleteReview(Long userId, Long reviewId) {
        UserEntity user = userRepository.findByIdWithReviews(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.getReviews().removeIf(review -> review.getId().equals(reviewId));
        userRepository.save(user);
    }

    /**
     * Ví dụ 18: Cập nhật review của user
     */
    public void updateReview(Long userId, Long recipeId, Integer newRating, String newComment) {
        UserEntity user = userRepository.findByIdWithReviews(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        ReviewEntity review = user.getReviews().stream()
                .filter(r -> r.getRecipe().getId().equals(recipeId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Review not found"));
        
        review.setRating(newRating);
        review.setComment(newComment);
        userRepository.save(user);
    }

    // ============================================================================
    // 5. ADVANCED EXAMPLES: Complex Operations
    // ============================================================================

    /**
     * Ví dụ 19: Lấy user với tất cả relationships (nguy hiểm với lazy loading)
     */
    @Transactional(readOnly = true)
    public UserEntity getUserWithAllData(Long userId) {
        // Sử dụng custom query với JOIN FETCH để tải tất cả dữ liệu
        return userRepository.findByIdWithAllRelationships(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    /**
     * Ví dụ 20: Xóa user cùng với tất cả relationships
     */
    public void deleteUserWithAllData(Long userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Hibernate sẽ tự động xóa tất cả child records do CASCADE DELETE
        userRepository.delete(user);
    }

    /**
     * Ví dụ 21: Clone recipes từ user này sang user khác
     */
    public void cloneRecipes(Long fromUserId, Long toUserId) {
        UserEntity fromUser = userRepository.findByIdWithRecipes(fromUserId)
                .orElseThrow(() -> new RuntimeException("Source user not found"));
        
        UserEntity toUser = userRepository.findById(toUserId)
                .orElseThrow(() -> new RuntimeException("Target user not found"));
        
        fromUser.getRecipes().forEach(recipe -> {
            RecipeEntity clonedRecipe = RecipeEntity.builder()
                    .title(recipe.getTitle())
                    .instructions(recipe.getInstructions())
                    .isPublic(false)
                    .user(toUser)
                    .build();
            
            toUser.getRecipes().add(clonedRecipe);
        });
        
        userRepository.save(toUser);
    }

    /**
     * Ví dụ 22: Lấy thống kê của user
     */
    @Transactional(readOnly = true)
    public UserStatistics getUserStatistics(Long userId) {
        UserEntity user = userRepository.findByIdWithAllRelationships(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return UserStatistics.builder()
                .userId(userId)
                .roleCount(user.getRoles().size())
                .recipeCount(user.getRecipes().size())
                .mealPlanCount(user.getMealPlans().size())
                .reviewCount(user.getReviews().size())
                .averageReviewRating(calculateAverageRating(user.getReviews()))
                .build();
    }

    private Double calculateAverageRating(Set<ReviewEntity> reviews) {
        if (reviews.isEmpty()) return 0.0;
        return reviews.stream()
                .mapToInt(ReviewEntity::getRating)
                .average()
                .orElse(0.0);
    }

    // ============================================================================
    // HELPER CLASSES
    // ============================================================================

    public static class UserStatistics {
        public Long userId;
        public int roleCount;
        public int recipeCount;
        public int mealPlanCount;
        public int reviewCount;
        public Double averageReviewRating;

        // Constructor
        private UserStatistics(Builder builder) {
            this.userId = builder.userId;
            this.roleCount = builder.roleCount;
            this.recipeCount = builder.recipeCount;
            this.mealPlanCount = builder.mealPlanCount;
            this.reviewCount = builder.reviewCount;
            this.averageReviewRating = builder.averageReviewRating;
        }

        public static Builder builder() {
            return new Builder();
        }

        public static class Builder {
            private Long userId;
            private int roleCount;
            private int recipeCount;
            private int mealPlanCount;
            private int reviewCount;
            private Double averageReviewRating;

            public Builder userId(Long userId) {
                this.userId = userId;
                return this;
            }

            public Builder roleCount(int roleCount) {
                this.roleCount = roleCount;
                return this;
            }

            public Builder recipeCount(int recipeCount) {
                this.recipeCount = recipeCount;
                return this;
            }

            public Builder mealPlanCount(int mealPlanCount) {
                this.mealPlanCount = mealPlanCount;
                return this;
            }

            public Builder reviewCount(int reviewCount) {
                this.reviewCount = reviewCount;
                return this;
            }

            public Builder averageReviewRating(Double averageReviewRating) {
                this.averageReviewRating = averageReviewRating;
                return this;
            }

            public UserStatistics build() {
                return new UserStatistics(this);
            }
        }

        @Override
        public String toString() {
            return "UserStatistics{" +
                    "userId=" + userId +
                    ", roleCount=" + roleCount +
                    ", recipeCount=" + recipeCount +
                    ", mealPlanCount=" + mealPlanCount +
                    ", reviewCount=" + reviewCount +
                    ", averageReviewRating=" + averageReviewRating +
                    '}';
        }
    }
}

