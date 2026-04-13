import { useQuery, useMutation } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { queryClient } from '../config/queryClient';
import { apiClient } from '../services';

export interface CreateMealPlanRequest {
  recipeId: number;
  planDate: string; // ISO date format: YYYY-MM-DD
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface MealPlanResponse {
  id: number;
  userId: number;
  recipeId: number;
  recipeName: string;
  recipeImage: string;
  planDate: string;
  mealType: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get all meal plans for authenticated user
 */
export const useGetMealPlans = (options?: UseQueryOptions<MealPlanResponse[], Error>) => {
  return useQuery({
    queryKey: ['mealPlans'],
    queryFn: async () => {
      return apiClient.get<MealPlanResponse[]>('/v1/meal-plans');
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    ...options,
  });
};

/**
 * Get weekly meal plans (Monday to Sunday)
 */
export const useGetWeeklyMealPlans = (
  date?: string,
  options?: UseQueryOptions<MealPlanResponse[], Error>
) => {
  return useQuery({
    queryKey: ['mealPlans', 'weekly', date],
    queryFn: async () => {
      const params = date ? `?date=${date}` : '';
      return apiClient.get<MealPlanResponse[]>(
        `/v1/meal-plans/weekly${params}`
      );
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    ...options,
  });
};

/**
 * Get meal plans for a specific date
 */
export const useGetMealPlansByDate = (
  date: string,
  options?: UseQueryOptions<MealPlanResponse[], Error>
) => {
  return useQuery({
    queryKey: ['mealPlans', 'date', date],
    queryFn: async () => {
      return apiClient.get<MealPlanResponse[]>(
        `/v1/meal-plans/date/${date}`
      );
    },
    enabled: !!date,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    ...options,
  });
};

/**
 * Get meal plans for a date range
 */
export const useGetMealPlansByDateRange = (
  startDate: string,
  endDate: string,
  options?: UseQueryOptions<MealPlanResponse[], Error>
) => {
  return useQuery({
    queryKey: ['mealPlans', 'range', startDate, endDate],
    queryFn: async () => {
      return apiClient.get<MealPlanResponse[]>(
        `/v1/meal-plans/range?startDate=${startDate}&endDate=${endDate}`
      );
    },
    enabled: !!startDate && !!endDate,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    ...options,
  });
};

/**
 * Get meal plans for a specific meal type
 */
export const useGetMealPlansByMealType = (
  mealType: string,
  options?: UseQueryOptions<MealPlanResponse[], Error>
) => {
  return useQuery({
    queryKey: ['mealPlans', 'type', mealType],
    queryFn: async () => {
      return apiClient.get<MealPlanResponse[]>(
        `/v1/meal-plans/type/${mealType}`
      );
    },
    enabled: !!mealType,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    ...options,
  });
};

/**
 * Get upcoming meal plans
 */
export const useGetUpcomingMealPlans = (
  options?: UseQueryOptions<MealPlanResponse[], Error>
) => {
  return useQuery({
    queryKey: ['mealPlans', 'upcoming'],
    queryFn: async () => {
      return apiClient.get<MealPlanResponse[]>(
        '/v1/meal-plans/upcoming'
      );
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    ...options,
  });
};

/**
 * Get past meal plans
 */
export const useGetPastMealPlans = (
  options?: UseQueryOptions<MealPlanResponse[], Error>
) => {
  return useQuery({
    queryKey: ['mealPlans', 'past'],
    queryFn: async () => {
      return apiClient.get<MealPlanResponse[]>(
        '/v1/meal-plans/past'
      );
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    ...options,
  });
};

/**
 * Create a new meal plan
 */
export const useCreateMealPlan = (
  options?: UseMutationOptions<MealPlanResponse, Error, CreateMealPlanRequest>
) => {
  return useMutation({
    mutationFn: async (data: CreateMealPlanRequest) => {
      return apiClient.post<MealPlanResponse>(
        '/v1/meal-plans',
        data
      );
    },
    onSuccess: async () => {
      // Invalidate all meal plan queries to refetch latest data
      await queryClient.invalidateQueries({ queryKey: ['mealPlans'] });
    },
    onError: (error: Error) => {
      console.error('Failed to create meal plan:', error);
    },
    ...options,
  });
};

/**
 * Delete meal plan by ID
 */
export const useDeleteMealPlan = (
  options?: UseMutationOptions<void, Error, number>
) => {
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/v1/meal-plans/${id}`);
    },
    onSuccess: async () => {
      // Invalidate all meal plan queries
      await queryClient.invalidateQueries({ queryKey: ['mealPlans'] });
    },
    onError: (error: Error) => {
      console.error('Failed to delete meal plan:', error);
    },
    ...options,
  });
};

/**
 * Delete meal plan by date and meal type
 */
export const useDeleteMealPlanByDateAndType = (
  options?: UseMutationOptions<
    void,
    Error,
    { date: string; mealType: string }
  >
) => {
  return useMutation({
    mutationFn: async ({ date, mealType }: { date: string; mealType: string }) => {
      await apiClient.delete(
        `/v1/meal-plans/day/${date}/type/${mealType}`
      );
    },
    onSuccess: async () => {
      // Invalidate all meal plan queries
      await queryClient.invalidateQueries({ queryKey: ['mealPlans'] });
    },
    onError: (error: Error) => {
      console.error('Failed to delete meal plan:', error);
    },
    ...options,
  });
};

