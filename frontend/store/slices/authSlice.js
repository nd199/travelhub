import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api, { getLocalStorageItem, setLocalStorageItem, removeLocalStorageItem } from '../../lib/api';
import axios from 'axios';

// API base URL for direct axios calls (refresh token)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed. Please try again.'
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed. Please try again.'
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/auth/logout');
      removeLocalStorageItem('token');
      removeLocalStorageItem('refreshToken');
      return {};
    } catch (error) {
      // Even if logout fails on server, clear local storage
      removeLocalStorageItem('token');
      removeLocalStorageItem('refreshToken');
      return {};
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = getLocalStorageItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
        refreshToken,
      });
      
      return response.data;
    } catch (error) {
      removeLocalStorageItem('token');
      removeLocalStorageItem('refreshToken');
      return rejectWithValue('Session expired. Please login again.');
    }
  }
);

export const verifyToken = createAsyncThunk(
  'auth/verifyToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/verify');
      return response.data;
    } catch (error) {
      return rejectWithValue('Token verification failed');
    }
  }
);

// Initial state
const initialState = {
  user: null,
  token: getLocalStorageItem('token'),
  refreshToken: getLocalStorageItem('refreshToken'),
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false,
};

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
        setLocalStorageItem('token', action.payload.token);
        setLocalStorageItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        removeLocalStorageItem('token');
        removeLocalStorageItem('refreshToken');
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
        setLocalStorageItem('token', action.payload.token);
        setLocalStorageItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        removeLocalStorageItem('token');
        removeLocalStorageItem('refreshToken');
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      // Refresh Token
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        setLocalStorageItem('token', action.payload.token);
        if (action.payload.refreshToken) {
          setLocalStorageItem('refreshToken', action.payload.refreshToken);
        }
      })
      .addCase(refreshToken.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      })
      // Verify Token
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isInitialized = true;
      })
      .addCase(verifyToken.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.isInitialized = true;
        removeLocalStorageItem('token');
        removeLocalStorageItem('refreshToken');
      });
  },
});

// Export actions
export const { clearError, setInitialized, updateUser } = authSlice.actions;

// Export reducer
export default authSlice.reducer;

// Export selector
export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
