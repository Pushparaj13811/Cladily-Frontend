import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

/**
 * Creates a configured Axios instance for API requests
 * @returns Configured Axios instance
 */
export function createApiInstance(): AxiosInstance {
  return axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, // To ensure cookies are sent with requests
  });
}

/**
 * Adds authorization token to request headers if provided
 * @param config Axios request configuration
 * @param token Authentication token
 * @returns Updated configuration with token
 */
export function addAuthToken(config: InternalAxiosRequestConfig, token: string | null): InternalAxiosRequestConfig {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
} 