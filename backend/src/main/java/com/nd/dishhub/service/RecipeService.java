package com.nd.dishhub.service;

import com.nd.dishhub.DTO.request.IngredientQuantityRequest;
import com.nd.dishhub.DTO.request.RecipeRequest;
import com.nd.dishhub.DTO.response.RecipeResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface RecipeService {

    RecipeResponse create(RecipeRequest request, Long userId);

    RecipeResponse update(Long id, RecipeRequest request);

    void delete(Long id);

    RecipeResponse getById(Long id);

    Page<RecipeResponse> getAll(Pageable pageable);

    Page<RecipeResponse> getPublicRecipes(Pageable pageable);

     Page<RecipeResponse> getRecipesByUser(Long userId, Pageable pageable);

     /**
      * Tìm kiếm công thức theo tên hoặc mô tả
      * @param query từ khóa tìm kiếm
      * @param pageable Thông tin phân trang
      * @return Page<RecipeResponse> chứa các công thức public phù hợp
      */
     Page<RecipeResponse> searchRecipes(String query, Pageable pageable);

     /**
      * Lọc công thức theo danh mục
      * @param category tên danh mục
      * @param pageable Thông tin phân trang
      * @return Page<RecipeResponse> chứa các công thức public trong danh mục
      */
     Page<RecipeResponse> getRecipesByCategory(String category, Pageable pageable);

    // ==================== CUSTOM RECIPE METHODS ====================

    /**
     * Clone một công thức nấu ăn gốc để tạo bản sao cá nhân
     * @param originalId ID của công thức gốc
     * @param userId ID của user hiện tại
     * @return RecipeResponse của công thức mới tạo
     */
    RecipeResponse forkRecipe(Long originalId, Long userId);

    /**
     * Cập nhật danh sách nguyên liệu cho công thức đã clone
     * @param recipeId ID của công thức cần cập nhật
     * @param newIngredients Danh sách nguyên liệu mới
     * @return RecipeResponse với thông tin dinh dưỡng đã tính toán lại
     */
    RecipeResponse updateRecipeIngredients(Long recipeId, List<IngredientQuantityRequest> newIngredients);

    /**
     * Tính toán lại thông tin dinh dưỡng cho công thức
     * Được trigger tự động sau khi cập nhật nguyên liệu
     * @param recipeId ID của công thức
     */
    void calculateNutrition(Long recipeId);

    /**
     * Lấy danh sách các công thức private do user tạo/clone
     * @param userId ID của user
     * @param pageable Thông tin phân trang
     * @return Page<RecipeResponse>
     */
    Page<RecipeResponse> getMyCustomRecipes(Long userId, Pageable pageable);

    /**
     * Upload hình ảnh cho công thức
     * @param file Hình ảnh cần upload
     * @return URL của hình ảnh đã upload
     * @throws IOException Nếu có lỗi khi upload
     */
    String uploadRecipeImage(MultipartFile file) throws IOException;
}
