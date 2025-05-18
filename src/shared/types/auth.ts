/**
 * Type definitions for authentication
 */

/**
 * User data interface
 */
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber: string;
  avatar?: string;
  role: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Signup data
 */
export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  agreeTerms: boolean;
  newsletter?: boolean;
}

/**
 * Password reset request
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * New password data
 */
export interface NewPasswordData {
  password: string;
  confirmPassword: string;
  token: string;
} 