import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

/**
 * Create a configured axios instance
 * @param {string} baseURL - Base URL for API calls (defaults to env variable or localhost)
 * @returns {AxiosInstance} Configured axios instance
 */
export const createApiInstance = (baseURL?: string): AxiosInstance => {
  const instance = axios.create({
    baseURL: baseURL || import.meta.env.VITE_API_URL || 'http://localhost:3000',
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for cookies
  });
  
  return instance;
};

/**
 * Add auth token to request config if provided
 * @param {AxiosRequestConfig} config - Axios request config
 * @param {string} token - Auth token to add
 * @returns {AxiosRequestConfig} Updated config with auth token
 */
export const addAuthToken = (config: AxiosRequestConfig, token?: string): AxiosRequestConfig => {
  if (!token) return config;
  
  return {
    ...config,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    },
  };
}; 