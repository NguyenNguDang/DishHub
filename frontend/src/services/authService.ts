import { apiClient } from './api';
import type { User } from '../types';

export const authService = {
  login: async (email: string, password: string) => {
    return apiClient.post<{ user: User; token: string }>('/v1/auth/login', {
      email,
      password,
    });
  },

  register: async (email: string, password: string, firstName: string, lastName: string) => {
    return apiClient.post<{ user: User; token: string }>('/v1/auth/register', {
      firstName,
      lastName,
      email,
      password,
    });
  },

  logout: async () => {
    return apiClient.post('/v1/auth/logout', {});
  },

  getCurrentUser: async () => {
    return apiClient.get<User>('/v1/auth/me');
  },
};
