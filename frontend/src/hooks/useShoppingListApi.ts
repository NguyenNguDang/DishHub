import { useQuery, useMutation } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ShoppingList, ShoppingListItem, UpdateShoppingListItemRequest, CreateShoppingListItemRequest } from '../types';
import { shoppingListService } from '../services';
import { queryClient } from '../config/queryClient';

/**
 * Hook để lấy danh sách mua sắm cho tuần cụ thể
 */
export const useGetShoppingList = (
  weekStart: string,
  options?: UseQueryOptions<ShoppingList, Error>
) => {
  return useQuery({
    queryKey: ['shoppingList', weekStart],
    queryFn: async () => {
      return shoppingListService.getShoppingList(weekStart);
    },
    enabled: !!weekStart,
    staleTime: 1000 * 60 * 5, // 5 phút
    gcTime: 1000 * 60 * 10, // 10 phút
    ...options,
  });
};

/**
 * Hook để cập nhật item trong danh sách mua sắm
 */
export const useUpdateShoppingListItem = (
  options?: UseMutationOptions<
    ShoppingListItem,
    Error,
    { shoppingListId: string; itemId: string; data: UpdateShoppingListItemRequest }
  >
) => {
  return useMutation({
    mutationFn: async ({ shoppingListId, itemId, data }) => {
      return shoppingListService.updateShoppingListItem(shoppingListId, itemId, data);
    },
    onSuccess: (_, { shoppingListId }) => {
      // Invalidate danh sách mua sắm
      queryClient.invalidateQueries({ queryKey: ['shoppingList', shoppingListId] });
    },
    onError: (error: Error) => {
      console.error('Failed to update shopping list item:', error);
    },
    ...options,
  });
};

/**
 * Hook để thêm item mới vào danh sách mua sắm
 */
export const useAddShoppingListItem = (
  options?: UseMutationOptions<
    ShoppingListItem,
    Error,
    { shoppingListId: string; data: CreateShoppingListItemRequest }
  >
) => {
  return useMutation({
    mutationFn: async ({ shoppingListId, data }) => {
      return shoppingListService.addShoppingListItem(shoppingListId, data);
    },
    onSuccess: (_, { shoppingListId }) => {
      // Invalidate danh sách mua sắm
      queryClient.invalidateQueries({ queryKey: ['shoppingList', shoppingListId] });
    },
    onError: (error: Error) => {
      console.error('Failed to add shopping list item:', error);
    },
    ...options,
  });
};

/**
 * Hook để xóa item khỏi danh sách mua sắm
 */
export const useDeleteShoppingListItem = (
  options?: UseMutationOptions<
    void,
    Error,
    { shoppingListId: string; itemId: string }
  >
) => {
  return useMutation({
    mutationFn: async ({ shoppingListId, itemId }) => {
      return shoppingListService.deleteShoppingListItem(shoppingListId, itemId);
    },
    onSuccess: (_, { shoppingListId }) => {
      // Invalidate danh sách mua sắm
      queryClient.invalidateQueries({ queryKey: ['shoppingList', shoppingListId] });
    },
    onError: (error: Error) => {
      console.error('Failed to delete shopping list item:', error);
    },
    ...options,
  });
};

/**
 * Hook để chia sẻ danh sách mua sắm
 */
export const useShareShoppingList = (
  options?: UseMutationOptions<
    { shareUrl: string },
    Error,
    { shoppingListId: string; email: string }
  >
) => {
  return useMutation({
    mutationFn: async ({ shoppingListId, email }) => {
      return shoppingListService.shareShoppingList(shoppingListId, email);
    },
    onError: (error: Error) => {
      console.error('Failed to share shopping list:', error);
    },
    ...options,
  });
};

/**
 * Hook để tự động generate shopping list từ meal plans của tuần
 */
export const useGenerateShoppingListFromWeek = (
  weekStart: string,
  options?: UseQueryOptions<ShoppingList, Error>
) => {
  return useQuery({
    queryKey: ['shoppingList', 'generated', weekStart],
    queryFn: async () => {
      return shoppingListService.generateShoppingListFromWeek(weekStart);
    },
    enabled: !!weekStart,
    staleTime: 1000 * 60 * 5, // 5 phút
    gcTime: 1000 * 60 * 10, // 10 phút
    ...options,
  });
};

