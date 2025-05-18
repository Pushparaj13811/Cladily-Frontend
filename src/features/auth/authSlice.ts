import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { createApiInstance } from '../../app/lib/apiUtils';
import { 
  User, 
  AuthState, 
  AuthResponse, 
  MessageResponse,
  UserDebugInfo,
  AdminAccessResponse
} from '@shared/types';

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

// Helper function for error handling in thunks
const handleAxiosError = (error: unknown, defaultMessage: string): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || defaultMessage;
  }
  return `${defaultMessage}: An unexpected error occurred`;
};

// Login thunk
export const login = createAsyncThunk<
  AuthResponse,
  { phone: string; password: string },
  { rejectValue: string }
>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/login`, credentials);
      
      // Validate that we received a proper token
      const data = response.data.data;
      if (!data || !data.accessToken) {
        return rejectWithValue('Invalid response from server: Missing authentication token');
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(handleAxiosError(error, 'Invalid credentials'));
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
      const response = await api.post(`${API_URL}/register`, userData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleAxiosError(error, 'Registration failed'));
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
      const response = await api.get('/api/user/profile');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleAxiosError(error, 'Failed to fetch user profile'));
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
      return rejectWithValue(handleAxiosError(error, 'Failed to update profile'));
    }
  }
);

// Logout thunk
export const logout = createAsyncThunk<
  null,
  void,
  { rejectValue: string; state: { auth: AuthState } }
>(
  'auth/logout',
  async (_, { getState }) => {
    try {
      const state = getState();
      const refreshToken = state.auth.refreshToken;
      const userId = state.auth.user?.id;
      
      // If there's no refreshToken or userId, we can just return (the reducer will clear state)
      if (!refreshToken || !userId) {
        return null;
      }
      
      // Send the refreshToken in the request body (userId comes from auth middleware)
      await api.post(`${API_URL}/logout`, { refreshToken });
      return null;
    } catch {
      // Return null instead of rejecting so the state still gets cleared
      return null;
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
      return rejectWithValue(handleAxiosError(error, 'Failed to request OTP'));
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
      return rejectWithValue(handleAxiosError(error, 'OTP verification failed'));
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
        return rejectWithValue('No refresh token available');
      }
      
      const response = await api.post(`${API_URL}/refresh-token`, {
        refreshToken
      });
      
      const data = response.data.data;
      if (!data || !data.accessToken) {
        return rejectWithValue('Invalid response from server: Missing new token');
      }
      
      // Return both tokens, handling case where refreshToken might not be in response
      return {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken || refreshToken // Use existing refresh token if not returned
      };
    } catch (error) {
      // Check for specific error about JWT secret
      if (axios.isAxiosError(error) && 
          (error.response?.data?.message?.includes('secretOrPrivateKey') || 
          error.message?.includes('secretOrPrivateKey'))) {
        return rejectWithValue('Authentication server error: JWT configuration issue');
      }
      
      return rejectWithValue(handleAxiosError(error, 'Failed to refresh token'));
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
      return rejectWithValue(handleAxiosError(error, 'Failed to send reset password email'));
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
      return rejectWithValue(handleAxiosError(error, 'Failed to reset password'));
    }
  }
);

// Get user debug info
export const getUserDebugInfo = createAsyncThunk<
  UserDebugInfo,
  void,
  { rejectValue: string }
>(
  'auth/getUserDebugInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/auth/debug');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleAxiosError(error, 'Failed to fetch user debug info'));
    }
  }
);

// Test admin access
export const testAdminAccess = createAsyncThunk<
  AdminAccessResponse,
  void,
  { rejectValue: string }
>(
  'auth/testAdminAccess',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/auth/admin-test');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleAxiosError(error, 'Failed to verify admin access'));
    }
  }
);

// Activate Account thunk
export const activateAccount = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>(
  'auth/activateAccount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/auth/activate-account');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleAxiosError(error, 'Failed to activate account'));
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
      })
      
      // Get user debug info
      .addCase(getUserDebugInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserDebugInfo.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getUserDebugInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch user debug info';
      })
      
      // Test admin access
      .addCase(testAdminAccess.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(testAdminAccess.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(testAdminAccess.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to verify admin access';
      })
      
      // Activate Account
      .addCase(activateAccount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(activateAccount.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(activateAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to activate account';
      });
  },
});

export const { clearError, setAuthToken } = authSlice.actions;

export default authSlice.reducer; 