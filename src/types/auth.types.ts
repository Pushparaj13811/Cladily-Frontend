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

/**
 * Debug information about the user and their authentication state
 */
export interface UserDebugInfo {
  user: {
    id: string;
    email?: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: UserRole;
    status: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
  sessions: Array<{
    id: string;
    createdAt: string;
    expiresAt: string;
    deviceInfo?: string;
    ipAddress?: string;
  }>;
  authInfo: {
    authenticated: boolean;
    tokenPayload: {
      userId: string;
      role: UserRole;
    };
  };
}

/**
 * Response from the admin access test endpoint
 */
export interface AdminAccessResponse {
  user: {
    id: string;
    role: UserRole;
    name: string;
  };
  message: string;
}