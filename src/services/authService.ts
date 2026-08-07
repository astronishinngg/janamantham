// src/services/authService.ts

export interface LoginCredentials {
  email: string;
  password: string;
}

export const authService = {
  login: async (credentials: LoginCredentials) => {
    // 1. Show loading state for 800ms (Simulate API call)
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 2. Validate hardcoded credentials
    if (
      credentials.email === 'janamanthan@gov.in' &&
      credentials.password === 'janamanthan@2026'
    ) {
      const user = {
        name: 'Government Officer',
        email: 'janamanthan@gov.in',
        role: 'Officer'
      };

      // 3. Save prototype tokens
      localStorage.setItem('jm_token', 'prototype_authenticated');
      localStorage.setItem('jm_user', JSON.stringify(user));

      return user;
    }

    // 4. Throw error for invalid credentials
    throw new Error('Invalid Government Credentials');
  },

  logout: () => {
    // Remove prototype tokens
    localStorage.removeItem('jm_token');
    localStorage.removeItem('jm_user');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('jm_token');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('jm_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: () => {
    return localStorage.getItem('jm_token');
  }
};