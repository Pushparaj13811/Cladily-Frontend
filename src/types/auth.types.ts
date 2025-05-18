/**
 * Auth-related type definitions
 */

// User role enum for type safety
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  CUSTOMER = 'customer'
}

// User model
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  avatar?: string;
  role: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth state in Redux store
export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// API response types
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface MessageResponse {
  message: string;
}

// Location state including from property for redirects
export interface LocationState {
  from?: {
    pathname: string;
  };
} 