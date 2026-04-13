package com.nd.dishhub.service;

import com.nd.dishhub.DTO.request.CreateShoppingListItemRequest;
import com.nd.dishhub.DTO.request.UpdateShoppingListItemRequest;
import com.nd.dishhub.DTO.response.ShoppingListItemResponse;
import com.nd.dishhub.DTO.response.ShoppingListResponse;
import com.nd.dishhub.model.ShoppingListEntity;
import com.nd.dishhub.model.ShoppingListItemEntity;
import com.nd.dishhub.model.UserEntity;
import com.nd.dishhub.model.MealPlanEntity;
import com.nd.dishhub.model.RecipeEntity;
import com.nd.dishhub.repository.ShoppingListRepository;
import com.nd.dishhub.repository.UserRepository;
import com.nd.dishhub.repository.MealPlanRepository;
import com.nd.dishhub.repository.RecipeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;
import java.util.*;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ShoppingListService {
    
    private final ShoppingListRepository shoppingListRepository;
    private final UserRepository userRepository;
    private final MealPlanRepository mealPlanRepository;
    private final RecipeRepository recipeRepository;
    
    /**
     * Lấy shopping list cho tuần cụ thể
     */
    public ShoppingListResponse getShoppingListByWeek(String weekStart) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Parse week start date từ string (định dạng "Apr 12 — Apr 18, 2026")
        LocalDate parsedDate = parseWeekStartDate(weekStart);
        
        ShoppingListEntity shoppingList = shoppingListRepository
            .findByUserIdAndWeekStart(user.getId(), parsedDate)
            .orElseGet(() -> createNewShoppingList(user, parsedDate));
        
        return mapToResponse(shoppingList);
    }
    
    /**
     * Cập nhật item trong shopping list
     */
    public ShoppingListItemResponse updateShoppingListItem(
        Long shoppingListId,
        Long itemId,
        UpdateShoppingListItemRequest request
    ) {
        ShoppingListEntity shoppingList = shoppingListRepository.findById(shoppingListId)
            .orElseThrow(() -> new RuntimeException("Shopping list not found"));
        
        ShoppingListItemEntity item = shoppingList.getItems().stream()
            .filter(i -> i.getId().equals(itemId))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Item not found"));
        
        if (request.getName() != null) item.setName(request.getName());
        if (request.getQuantity() != null) item.setQuantity(request.getQuantity());
        if (request.getUnit() != null) item.setUnit(request.getUnit());
        if (request.getCategory() != null) item.setCategory(request.getCategory());
        if (request.getIsChecked() != null) item.setIsChecked(request.getIsChecked());
        
        return mapItemToResponse(item);
    }
    
    /**
     * Xóa item khỏi shopping list
     */
    public void deleteShoppingListItem(Long shoppingListId, Long itemId) {
        ShoppingListEntity shoppingList = shoppingListRepository.findById(shoppingListId)
            .orElseThrow(() -> new RuntimeException("Shopping list not found"));
        
        shoppingList.getItems().removeIf(i -> i.getId().equals(itemId));
    }

    /**
     * Thêm item mới vào shopping list
     */
    public ShoppingListItemResponse addShoppingListItem(
        Long shoppingListId,
        CreateShoppingListItemRequest request
    ) {
        ShoppingListEntity shoppingList = shoppingListRepository.findById(shoppingListId)
            .orElseThrow(() -> new RuntimeException("Shopping list not found"));
        
        ShoppingListItemEntity newItem = ShoppingListItemEntity.builder()
            .name(request.getName())
            .quantity(request.getQuantity())
            .unit(request.getUnit())
            .category(request.getCategory())
            .isChecked(false)
            .shoppingList(shoppingList)
            .build();
        
        shoppingList.getItems().add(newItem);
        shoppingListRepository.save(shoppingList);
        
        return mapItemToResponse(newItem);
    }
    
     /**
      * Chia sẻ shopping list (dummy implementation)
      */
     public String shareShoppingList(Long shoppingListId, String email) {
         // TODO: Implement proper sharing logic with permissions
         return "https://dishhub.com/shared-shopping-list/" + shoppingListId;
     }
     
     /**
      * Generate shopping list từ meal plans của tuần
      * Tự động extract ingredients từ recipes
      */
     public ShoppingListResponse generateShoppingListFromWeek(String weekStart) {
         log.info("Generating shopping list from meal plans for week: {}", weekStart);
         
         String email = SecurityContextHolder.getContext().getAuthentication().getName();
         UserEntity user = userRepository.findByEmail(email)
             .orElseThrow(() -> new RuntimeException("User not found"));
         
         // Parse week start date
         LocalDate parsedDate = parseWeekStartDate(weekStart);
         LocalDate endDate = parsedDate.plusDays(6); // Sunday of the week
         
         // Lấy tất cả meal plans trong tuần
         List<MealPlanEntity> mealPlans = mealPlanRepository
             .findByUserIdAndPlanDateBetween(user.getId(), parsedDate, endDate);
         
         log.info("Found {} meal plans for user {} in week {}", mealPlans.size(), user.getId(), weekStart);
         
         // Get or create shopping list for this week
         ShoppingListEntity shoppingList = shoppingListRepository
             .findByUserIdAndWeekStart(user.getId(), parsedDate)
             .orElseGet(() -> createNewShoppingList(user, parsedDate));
         
         // Clear existing items
         shoppingList.getItems().clear();
         
         // Map để aggregate ingredients (name -> total quantity)
         Map<String, IngredientAgg> ingredientMap = new HashMap<>();
         
          // Extract ingredients từ tất cả recipes
          for (MealPlanEntity mealPlan : mealPlans) {
              RecipeEntity recipe = mealPlan.getRecipe();
              
              // Extract từ recipe_ingredients table
              if (recipe != null && recipe.getRecipeIngredients() != null && !recipe.getRecipeIngredients().isEmpty()) {
                  for (com.nd.dishhub.model.RecipeIngredientEntity ri : recipe.getRecipeIngredients()) {
                      if (ri.getIngredient() == null) continue;
                      
                      String key = ri.getIngredient().getName();
                      Double quantity = ri.getQuantity() != null ? ri.getQuantity() : 0.0;
                      String unit = ri.getUnit() != null ? ri.getUnit() : "";
                      
                      // Merge if ingredient already exists, sum quantities
                      ingredientMap.merge(key, 
                          new IngredientAgg(key, quantity, unit),
                          (existing, newVal) -> {
                              existing.quantity += newVal.quantity;
                              return existing;
                          });
                  }
              } else {
                  log.debug("Recipe {} has no ingredients", recipe != null ? recipe.getId() : "null");
              }
          }
         
         // Convert to shopping list items
         for (IngredientAgg agg : ingredientMap.values()) {
             ShoppingListItemEntity item = ShoppingListItemEntity.builder()
                 .name(agg.name)
                 .quantity(agg.quantity)
                 .unit(agg.unit)
                 .category(getCategoryForIngredient(agg.name))
                 .isChecked(false)
                 .shoppingList(shoppingList)
                 .build();
             shoppingList.getItems().add(item);
         }
         
         // Save shopping list
         shoppingListRepository.save(shoppingList);
         log.info("Shopping list generated with {} items", shoppingList.getItems().size());
         
         return mapToResponse(shoppingList);
     }
     
     /**
      * Helper class để aggregate ingredients
      */
     private static class IngredientAgg {
         String name;
         Double quantity;
         String unit;
         
         IngredientAgg(String name, Double quantity, String unit) {
             this.name = name;
             this.quantity = quantity;
             this.unit = unit;
         }
     }
     
     /**
      * Determine category cho ingredient
      */
     private String getCategoryForIngredient(String ingredientName) {
         String lower = ingredientName.toLowerCase();
         
         // Produce
         if (lower.contains("spinach") || lower.contains("lettuce") || lower.contains("vegetable") ||
             lower.contains("pepper") || lower.contains("tomato") || lower.contains("onion") ||
             lower.contains("garlic") || lower.contains("carrot") || lower.contains("potato")) {
             return "Produce";
         }
         
         // Meat & Seafood
         if (lower.contains("chicken") || lower.contains("beef") || lower.contains("salmon") ||
             lower.contains("fish") || lower.contains("meat") || lower.contains("pork")) {
             return "Meat & Seafood";
         }
         
         // Dairy & Eggs
         if (lower.contains("milk") || lower.contains("yogurt") || lower.contains("cheese") ||
             lower.contains("egg") || lower.contains("butter")) {
             return "Dairy & Eggs";
         }
         
         // Default to Pantry
         return "Pantry";
     }
    
    // ============ Helper Methods ============
    
    private ShoppingListEntity createNewShoppingList(UserEntity user, LocalDate weekStart) {
        ShoppingListEntity shoppingList = ShoppingListEntity.builder()
            .user(user)
            .weekStart(weekStart)
            .build();
        return shoppingListRepository.save(shoppingList);
    }
    
    private LocalDate parseWeekStartDate(String weekString) {
        // Input can be either:
        // 1. ISO format: "2026-04-12" (from API)
        // 2. Display format: "Apr 12 — Apr 18, 2026" (from UI)
        try {
            // Try ISO format first (YYYY-MM-DD)
            if (weekString != null && weekString.matches("\\d{4}-\\d{2}-\\d{2}")) {
                DateTimeFormatter isoFormatter = DateTimeFormatter.ISO_LOCAL_DATE;
                return LocalDate.parse(weekString, isoFormatter);
            }
            
            // Try display format: "Apr 12 — Apr 18, 2026"
            if (weekString != null && weekString.contains("—")) {
                String[] parts = weekString.split("—");
                if (parts.length >= 1) {
                    String startPart = parts[0].trim(); // "Apr 12"
                    String endPart = parts.length > 1 ? parts[1].trim() : ""; // "Apr 18, 2026"
                    
                    // Extract year from endPart or use current year
                    String year;
                    if (endPart.length() >= 4) {
                        year = endPart.substring(endPart.length() - 4);
                    } else {
                        year = String.valueOf(java.time.Year.now().getValue());
                    }
                    
                    String fullDate = startPart + ", " + year; // "Apr 12, 2026"
                    
                    // Use Locale.ENGLISH to parse month names like "Apr"
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy", java.util.Locale.ENGLISH);
                    return LocalDate.parse(fullDate, formatter);
                }
            }
            
            // Fallback
            throw new IllegalArgumentException("Invalid week format: " + weekString);
        } catch (Exception e) {
            // Fallback: return today's week start if parsing fails
            System.err.println("Failed to parse week date: " + weekString + ". Error: " + e.getMessage());
            LocalDate today = LocalDate.now();
            return today.minusDays(today.getDayOfWeek().getValue() - 1); // Monday of current week
        }
    }
    
    private ShoppingListResponse mapToResponse(ShoppingListEntity entity) {
        return ShoppingListResponse.builder()
            .id(entity.getId())
            .userId(entity.getUser().getId())
            .items(entity.getItems() != null ? entity.getItems().stream()
                .map(this::mapItemToResponse)
                .collect(Collectors.toList()) : java.util.Collections.emptyList())
            .createdAt(entity.getCreatedAt())
            .updatedAt(entity.getUpdatedAt())
            .build();
    }
    
    private ShoppingListItemResponse mapItemToResponse(ShoppingListItemEntity entity) {
        return ShoppingListItemResponse.builder()
            .id(entity.getId())
            .name(entity.getName())
            .quantity(entity.getQuantity())
            .unit(entity.getUnit())
            .category(entity.getCategory())
            .isChecked(entity.getIsChecked())
            .createdAt(entity.getCreatedAt())
            .updatedAt(entity.getUpdatedAt())
            .build();
    }
}

