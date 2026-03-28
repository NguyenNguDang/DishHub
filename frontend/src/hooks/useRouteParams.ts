/**
 * useRouteParams.ts
 * Hook để lấy route params với type-safety
 * 
 * Ví dụ:
 * const { id } = useRouteParams<RecipeDetailParams>();
 */

import { useParams } from 'react-router-dom';

export const useRouteParams = <T extends Record<string, string | undefined>>(): T => {
  return useParams<keyof T>() as T;
};
