package com.nd.dishhub.service;

import com.nd.dishhub.DTO.request.CreateShoppingListItemRequest;
import com.nd.dishhub.DTO.request.UpdateShoppingListItemRequest;
import com.nd.dishhub.DTO.response.ShoppingListItemResponse;
import com.nd.dishhub.DTO.response.ShoppingListResponse;
import com.nd.dishhub.model.ShoppingListEntity;
import com.nd.dishhub.model.ShoppingListItemEntity;
import com.nd.dishhub.model.UserEntity;
import com.nd.dishhub.repository.ShoppingListRepository;
import com.nd.dishhub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ShoppingListService {
    
    private final ShoppingListRepository shoppingListRepository;
    private final UserRepository userRepository;
    
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
    
    // ============ Helper Methods ============
    
    private ShoppingListEntity createNewShoppingList(UserEntity user, LocalDate weekStart) {
        ShoppingListEntity shoppingList = ShoppingListEntity.builder()
            .user(user)
            .weekStart(weekStart)
            .build();
        return shoppingListRepository.save(shoppingList);
    }
    
    private LocalDate parseWeekStartDate(String weekString) {
        // Input: "Apr 12 — Apr 18, 2026"
        // Extract: "Apr 12, 2026"
        try {
            String[] parts = weekString.split("—");
            String startPart = parts[0].trim(); // "Apr 12"
            String endPart = parts[1].trim(); // "Apr 18, 2026"
            
            // Extract year from endPart
            String year = endPart.substring(endPart.length() - 4);
            String fullDate = startPart + ", " + year; // "Apr 12, 2026"
            
            // ✅ Use Locale.ENGLISH to parse month names like "Apr"
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy", java.util.Locale.ENGLISH);
            return LocalDate.parse(fullDate, formatter);
        } catch (Exception e) {
            // ✅ Fallback: return today's week start if parsing fails
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

