import { useQuery, useMutation } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { UserProfile } from '../types';
import { userProfileService, type UpdateProfileRequest } from '../services/userProfileService';
import { queryClient } from '../config/queryClient';

/**
 * Hook để lấy profile của user hiện tại
 */
export const useCurrentProfile = (
  options?: UseQueryOptions<UserProfile, Error>
) => {
  return useQuery({
    queryKey: ['currentProfile'],
    queryFn: async () => {
      return userProfileService.getCurrentProfile();
    },
    staleTime: 1000 * 60 * 5, // 5 phút
    gcTime: 1000 * 60 * 10, // 10 phút
    ...options,
  });
};

/**
 * Hook để cập nhật profile
 */
export const useUpdateProfile = (
  options?: UseMutationOptions<UserProfile, Error, UpdateProfileRequest>
) => {
  return useMutation({
    mutationFn: async (data: UpdateProfileRequest) => {
      return userProfileService.updateProfile(data);
    },
    onSuccess: (updatedProfile: UserProfile) => {
      // Update cache
      queryClient.setQueryData(['currentProfile'], updatedProfile);
    },
    onError: (error: Error) => {
      console.error('Failed to update profile:', error);
    },
    ...options,
  });
};

/**
 * Hook để upload avatar
 */
export const useUploadAvatar = (
  options?: UseMutationOptions<string, Error, File>
) => {
  return useMutation({
    mutationFn: async (file: File) => {
      return userProfileService.uploadAvatar(file);
    },
    onSuccess: (avatarUrl: string) => {
      // Update profile cache với avatar URL mới
      const currentProfile = queryClient.getQueryData<UserProfile>(['currentProfile']);
      if (currentProfile) {
        queryClient.setQueryData(['currentProfile'], {
          ...currentProfile,
          avatar: avatarUrl,
        });
      }
    },
    onError: (error: Error) => {
      console.error('Failed to upload avatar:', error);
    },
    ...options,
  });
};

