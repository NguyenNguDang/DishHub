import { apiClient } from './api';
import type { User } from '../types';

export const authService = {
  login: async (email: string, password: string) => {
    return apiClient.post<{ user: User; token: string }>('/auth/login', {
      email,
      password,
    });
  },

  register: async (email: string, password: string, username: string) => {
    return apiClient.post<{ user: User; token: string }>('/auth/register', {
      email,
      password,
      username,
    });
  },

  logout: async () => {
    return apiClient.post('/auth/logout', {});
  },

  getCurrentUser: async () => {
    return apiClient.get<User>('/auth/me');
  },
};
