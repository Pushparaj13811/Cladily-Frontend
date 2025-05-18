import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { createApiInstance } from '../../app/lib/apiUtils';
import { 
  User, 
  AuthState, 
  AuthResponse, 
  MessageResponse
} from '../../types';

// Create API client for auth requests
const api = createApiInstance();

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Base URL for API calls
const API_URL = '/api/auth';

// Login thunk
export const login = createAsyncThunk<
  AuthResponse,
  { phone: string; password: string },
  { rejectValue: string }
>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('Attempting login with credentials:', { phone: credentials.phone });
      const response = await api.post(`${API_URL}/login`, credentials);
      
      // Validate that we received a proper token
      const data = response.data.data;
      if (!data || !data.accessToken) {
        console.error('Invalid login response - missing token:', data);
        return rejectWithValue('Invalid response from server: Missing authentication token');
      }
      
      console.log('Login successful, received token');
      return data;
    } catch (error) {
      console.error('Login error:', error);
      
      if (axios.isAxiosError(error)) {
        // Check for specific error about JWT secret
        if (error.response?.data?.message?.includes('secretOrPrivateKey') || 
            error.message?.includes('secretOrPrivateKey')) {
          console.error('JWT Secret key error detected');
          return rejectWithValue('Authentication server error: JWT configuration issue');
        }
        
        const errorMessage = error.response?.data?.message || 'Login failed';
        console.error('Login failed with message:', errorMessage);
        return rejectWithValue(errorMessage);
      }
      
      return rejectWithValue('Login failed: An unexpected error occurred');
    }
  }
);

// Register thunk
export const register = createAsyncThunk<
  MessageResponse,
  { 
    firstName: string; 
    lastName: string; 
    email: string; 
    phone: string; 
    password: string;
  },
  { rejectValue: string }
>(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      console.log('Attempting registration');
      const response = await api.post(`${API_URL}/register`, userData);
      console.log('Registration successful');
      return response.data.data;
    } catch (error) {
      console.error('Registration error:', error);
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Registration failed');
      }
      return rejectWithValue('Registration failed: An unexpected error occurred');
    }
  }
);

// Get user profile thunk
export const getUserProfile = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>(
  'auth/getUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      // We'll set the auth token in the API interceptor when configured
      const response = await api.get('/api/user/profile');
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch user profile');
      }
      return rejectWithValue('Failed to fetch user profile');
    }
  }
);

// Update user profile thunk
export const updateUserProfile = createAsyncThunk<
  User,
  Partial<User>,
  { rejectValue: string }
>(
  'auth/updateUserProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.put('/api/user/profile', userData);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
      }
      return rejectWithValue('Failed to update profile');
    }
  }
);

// Logout thunk
export const logout = createAsyncThunk<
  null,
  void,
  { rejectValue: string }
>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.post(`${API_URL}/logout`);
      return null;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Logout failed');
      }
      return rejectWithValue('Logout failed');
    }
  }
);

// Request OTP thunk
export const requestOtp = createAsyncThunk<
  MessageResponse,
  string,
  { rejectValue: string }
>(
  'auth/requestOtp',
  async (phone, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/request-otp`, { phone });
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to request OTP');
      }
      return rejectWithValue('Failed to request OTP');
    }
  }
);

// Verify OTP thunk
export const verifyOtp = createAsyncThunk<
  AuthResponse,
  { phone: string; otp: string },
  { rejectValue: string }
>(
  'auth/verifyOtp',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/verify-otp`, credentials);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'OTP verification failed');
      }
      return rejectWithValue('OTP verification failed');
    }
  }
);

// Refresh token thunk
export const refreshAccessToken = createAsyncThunk<
  { accessToken: string; refreshToken: string },
  void,
  { rejectValue: string; state: { auth: AuthState } }
>(
  'auth/refreshToken',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const refreshToken = state.auth.refreshToken;
      
      if (!refreshToken) {
        console.error('No refresh token available');
        return rejectWithValue('No refresh token available');
      }
      
      console.log('Attempting to refresh token');
      
      const response = await api.post(`${API_URL}/refresh-token`, {
        refreshToken
      });
      
      const data = response.data.data;
      if (!data || !data.accessToken) {
        console.error('Invalid refresh token response - missing new token:', data);
        return rejectWithValue('Invalid response from server: Missing new token');
      }
      
      console.log('Token refresh successful, received new token');
      return data;
    } catch (error) {
      console.error('Token refresh error:', error);
      
      if (axios.isAxiosError(error)) {
        // Check for specific error about JWT secret
        if (error.response?.data?.message?.includes('secretOrPrivateKey') || 
            error.message?.includes('secretOrPrivateKey')) {
          console.error('JWT Secret key error detected during refresh');
          return rejectWithValue('Authentication server error: JWT configuration issue');
        }
        
        const errorMessage = error.response?.data?.message || 'Failed to refresh token';
        console.error('Token refresh failed with message:', errorMessage);
        return rejectWithValue(errorMessage);
      }
      
      return rejectWithValue('Failed to refresh token: An unexpected error occurred');
    }
  }
);

// Forgot Password thunk
export const forgotPassword = createAsyncThunk<
  MessageResponse,
  string,
  { rejectValue: string }
>(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/forgot-password`, { email });
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to send reset password email');
      }
      return rejectWithValue('Failed to send reset password email');
    }
  }
);

// Reset Password thunk
export const resetPassword = createAsyncThunk<
  MessageResponse,
  { token: string; password: string },
  { rejectValue: string }
>(
  'auth/resetPassword',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/reset-password`, credentials);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to reset password');
      }
      return rejectWithValue('Failed to reset password');
    }
  }
);

// Create the slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setAuthToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed';
      })
      
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Registration failed';
      })
      
      // Get user profile
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch user profile';
      })
      
      // Update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update profile';
      })
      
      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Logout failed';
      })
      
      // Request OTP
      .addCase(requestOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(requestOtp.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(requestOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to request OTP';
      })
      
      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'OTP verification failed';
      })
      
      // Refresh token
      .addCase(refreshAccessToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.error = action.payload || 'Failed to refresh token';
      })
      
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to send reset password email';
      })
      
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to reset password';
      });
  },
});

export const { clearError, setAuthToken } = authSlice.actions;

export default authSlice.reducer; 