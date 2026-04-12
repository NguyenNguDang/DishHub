import { apiClient } from './api';
import type { UserProfile } from '../types';

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  age?: number;
  weight?: number;
  height?: number;
  bio?: string;
  avatar?: string;
  preferences?: {
    theme?: 'light' | 'dark';
    language?: 'en' | 'vi';
    dietaryRestrictions?: string[];
  };
}

export const userProfileService = {
  /**
   * Lấy thông tin profile của user hiện tại
   */
  getCurrentProfile: async (): Promise<UserProfile> => {
    try {
      const response = await apiClient.get<UserProfile>('/v1/users/me');
      return response;
    } catch (error) {
      console.error('Error fetching current user profile:', error);
      throw error;
    }
  },

  /**
   * Cập nhật profile của user
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<UserProfile> => {
    try {
      const response = await apiClient.put<UserProfile>('/v1/users/me', data);
      return response;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  /**
   * Upload avatar
   */
  uploadAvatar: async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiClient.post<{ url: string }>('/v1/users/avatar', formData);
      return response.url;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  },
};

