/**
 * Type definitions for authentication
 */

/**
 * User data interface
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
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