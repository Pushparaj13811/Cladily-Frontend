import { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { refreshAccessToken, logout, setAuthToken } from '../../features/auth/authSlice';
import { createApiInstance, addAuthToken } from './apiUtils';
import { store } from '../store/store';

// Create API client with base configuration
const api: AxiosInstance = createApiInstance();

// Request interceptor to add authentication token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const state = store.getState();
    const token = state.auth?.token;
    
    console.log('Request interceptor - Adding auth token:', token ? 'Token exists' : 'No token');
    
    // Add auth token if available
    return addAuthToken(config, token);
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors and token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    console.error('API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      message: error.message,
      data: error.response?.data
    });
    
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('Received 401 error, attempting token refresh');
      
      if (isRefreshing) {
        console.log('Token refresh already in progress, queueing request');
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            console.log('Using refreshed token for queued request');
            if (typeof token === 'string') {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;
      console.log('Starting token refresh process');

      try {
        // Check if we have a refresh token before attempting refresh
        const state = store.getState();
        if (!state.auth?.refreshToken) {
          console.error('No refresh token available, logging out');
          await store.dispatch(logout());
          processQueue(new Error('No refresh token available'));
          isRefreshing = false;
          return Promise.reject(new Error('No refresh token available'));
        }
        
        const result = await store.dispatch(refreshAccessToken());
        
        if (refreshAccessToken.fulfilled.match(result)) {
          console.log('Token refresh successful');
          const newToken = result.payload.accessToken;
          
          // Store the token in Redux
          store.dispatch(setAuthToken(newToken));
          
          // Process the queue with the new token
          processQueue(null, newToken);
          
          // Update the request header with the new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          isRefreshing = false;
          return api(originalRequest);
        } else {
          console.error('Token refresh failed:', result.error);
          // Token refresh failed, logout user and reject all queued requests
          await store.dispatch(logout());
          processQueue(new Error('Refresh token failed'));
          isRefreshing = false;
          return Promise.reject(error);
        }
      } catch (refreshError) {
        console.error('Exception during token refresh:', refreshError);
        processQueue(refreshError instanceof Error ? refreshError : new Error('Unknown error'));
        isRefreshing = false;
        
        // Clear failed queue and reject the original request
        await store.dispatch(logout());
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api; 