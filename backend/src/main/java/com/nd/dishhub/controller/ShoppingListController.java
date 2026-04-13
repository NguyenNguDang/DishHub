package com.nd.dishhub.controller;

import com.nd.dishhub.DTO.request.CreateShoppingListItemRequest;
import com.nd.dishhub.DTO.request.UpdateShoppingListItemRequest;
import com.nd.dishhub.DTO.response.ShoppingListItemResponse;
import com.nd.dishhub.DTO.response.ShoppingListResponse;
import com.nd.dishhub.service.ShoppingListService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/shopping-lists")
@RequiredArgsConstructor
@Tag(name = "Shopping Lists", description = "APIs for shopping list management")
public class ShoppingListController {
    
    private final ShoppingListService shoppingListService;
    
    @GetMapping("/generate-from-week")
    @Operation(summary = "Generate shopping list from meal plans", description = "Automatically generates shopping list by extracting ingredients from meal plans of a specific week")
    @ApiResponse(responseCode = "200", description = "Shopping list generated successfully")
    @ApiResponse(responseCode = "401", description = "Unauthorized")
    public ResponseEntity<ShoppingListResponse> generateShoppingListFromWeek(
        @RequestParam String weekStart
    ) {
        ShoppingListResponse response = shoppingListService.generateShoppingListFromWeek(weekStart);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping
    @Operation(summary = "Get shopping list for a week", description = "Retrieves shopping list items for a specific week")
    @ApiResponse(responseCode = "200", description = "Shopping list retrieved successfully")
    @ApiResponse(responseCode = "401", description = "Unauthorized")
    public ResponseEntity<ShoppingListResponse> getShoppingList(
        @RequestParam String weekStart
    ) {
        ShoppingListResponse response = shoppingListService.getShoppingListByWeek(weekStart);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{shoppingListId}/items/{itemId}")
    @Operation(summary = "Update shopping list item", description = "Updates a specific item in the shopping list")
    @ApiResponse(responseCode = "200", description = "Item updated successfully")
    @ApiResponse(responseCode = "404", description = "Item not found")
    public ResponseEntity<ShoppingListItemResponse> updateShoppingListItem(
        @PathVariable Long shoppingListId,
        @PathVariable Long itemId,
        @RequestBody UpdateShoppingListItemRequest request
    ) {
        ShoppingListItemResponse response = shoppingListService.updateShoppingListItem(
            shoppingListId,
            itemId,
            request
        );
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{shoppingListId}/items/{itemId}")
    @Operation(summary = "Delete shopping list item", description = "Removes an item from the shopping list")
    @ApiResponse(responseCode = "204", description = "Item deleted successfully")
    @ApiResponse(responseCode = "404", description = "Item not found")
    public ResponseEntity<Void> deleteShoppingListItem(
        @PathVariable Long shoppingListId,
        @PathVariable Long itemId
    ) {
        shoppingListService.deleteShoppingListItem(shoppingListId, itemId);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/{shoppingListId}/items")
    @Operation(summary = "Add new shopping list item", description = "Creates a new item in the shopping list")
    @ApiResponse(responseCode = "200", description = "Item added successfully")
    @ApiResponse(responseCode = "404", description = "Shopping list not found")
    public ResponseEntity<ShoppingListItemResponse> addShoppingListItem(
        @PathVariable Long shoppingListId,
        @RequestBody CreateShoppingListItemRequest request
    ) {
        ShoppingListItemResponse response = shoppingListService.addShoppingListItem(
            shoppingListId,
            request
        );
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/{shoppingListId}/share")
    @Operation(summary = "Share shopping list", description = "Generates a shareable link for the shopping list")
    @ApiResponse(responseCode = "200", description = "Share link generated successfully")
    @ApiResponse(responseCode = "404", description = "Shopping list not found")
    public ResponseEntity<ShareResponse> shareShoppingList(
        @PathVariable Long shoppingListId,
        @RequestBody ShareRequest request
    ) {
        String shareUrl = shoppingListService.shareShoppingList(shoppingListId, request.getEmail());
        return ResponseEntity.ok(new ShareResponse(shareUrl));
    }
    
    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class ShareRequest {
        private String email;
    }
    
    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class ShareResponse {
        private String shareUrl;
    }
}

