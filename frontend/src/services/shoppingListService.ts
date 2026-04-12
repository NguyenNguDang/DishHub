import { apiClient } from './api';
import type { ShoppingList, ShoppingListItem, CreateShoppingListItemRequest, UpdateShoppingListItemRequest } from '../types';

export const shoppingListService = {
  /**
   * Lấy danh sách mua sắm của user cho tuần cụ thể
   */
  getShoppingList: async (weekStart: string): Promise<ShoppingList> => {
    try {
      const response = await apiClient.get<ShoppingList>(
        `/v1/shopping-lists?weekStart=${encodeURIComponent(weekStart)}`
      );
      return response;
    } catch (error) {
      console.error('Error fetching shopping list:', error);
      throw error;
    }
  },

  /**
   * Cập nhật item trong danh sách mua sắm
   */
  updateShoppingListItem: async (
    shoppingListId: string,
    itemId: string,
    data: UpdateShoppingListItemRequest
  ): Promise<ShoppingListItem> => {
    try {
      const response = await apiClient.put<ShoppingListItem>(
        `/v1/shopping-lists/${shoppingListId}/items/${itemId}`,
        data
      );
      return response;
    } catch (error) {
      console.error(`Error updating shopping list item ${itemId}:`, error);
      throw error;
    }
  },

  /**
   * Xóa item khỏi danh sách mua sắm
   */
  deleteShoppingListItem: async (
    shoppingListId: string,
    itemId: string
  ): Promise<void> => {
    try {
      await apiClient.delete(
        `/v1/shopping-lists/${shoppingListId}/items/${itemId}`
      );
    } catch (error) {
      console.error(`Error deleting shopping list item ${itemId}:`, error);
      throw error;
    }
  },

  /**
   * Thêm item mới vào danh sách mua sắm
   */
  addShoppingListItem: async (
    shoppingListId: string,
    data: CreateShoppingListItemRequest
  ): Promise<ShoppingListItem> => {
    try {
      const response = await apiClient.post<ShoppingListItem>(
        `/v1/shopping-lists/${shoppingListId}/items`,
        data
      );
      return response;
    } catch (error) {
      console.error('Error adding shopping list item:', error);
      throw error;
    }
  },

  /**
   * Chia sẻ danh sách mua sắm với người khác
   */
  shareShoppingList: async (shoppingListId: string, email: string): Promise<{ shareUrl: string }> => {
    try {
      const response = await apiClient.post<{ shareUrl: string }>(
        `/v1/shopping-lists/${shoppingListId}/share`,
        { email }
      );
      return response;
    } catch (error) {
      console.error('Error sharing shopping list:', error);
      throw error;
    }
  },
};

