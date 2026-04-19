import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Async thunks
export const getUserProfile = createAsyncThunk(
  'user/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/user/profile');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch profile'
      );
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.put('/user/profile', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update profile'
      );
    }
  }
);

export const changePassword = createAsyncThunk(
  'user/changePassword',
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await api.put('/user/change-password', {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to change password'
      );
    }
  }
);

export const uploadProfilePicture = createAsyncThunk(
  'user/uploadProfilePicture',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post('/user/upload-profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to upload profile picture'
      );
    }
  }
);

export const getUserBookings = createAsyncThunk(
  'user/getBookings',
  async ({ page = 1, limit = 10, status = 'all' }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/user/bookings?page=${page}&limit=${limit}&status=${status}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch bookings'
      );
    }
  }
);

export const getBookingDetails = createAsyncThunk(
  'user/getBookingDetails',
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/user/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch booking details'
      );
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'user/cancelBooking',
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await api.put(`/user/bookings/${bookingId}/cancel`);
      return { bookingId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to cancel booking'
      );
    }
  }
);

export const getUserPreferences = createAsyncThunk(
  'user/getPreferences',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/user/preferences');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch preferences'
      );
    }
  }
);

export const updateUserPreferences = createAsyncThunk(
  'user/updatePreferences',
  async (preferences, { rejectWithValue }) => {
    try {
      const response = await api.put('/user/preferences', preferences);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update preferences'
      );
    }
  }
);

// Initial state
const initialState = {
  profile: null,
  bookings: [],
  currentBooking: null,
  preferences: {
    language: 'en',
    currency: 'INR',
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
    travelPreferences: {
      preferredClass: 'Economy',
      mealPreference: 'Vegetarian',
      seatPreference: 'Window',
    },
  },
  isLoading: false,
  error: null,
  bookingsPagination: {
    currentPage: 1,
    totalPages: 1,
    totalBookings: 0,
  },
};

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    updateLocalPreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    addBookingToList: (state, action) => {
      state.bookings.unshift(action.payload);
      state.bookingsPagination.totalBookings += 1;
    },
    updateBookingInList: (state, action) => {
      const index = state.bookings.findIndex(
        (booking) => booking.id === action.payload.id
      );
      if (index !== -1) {
        state.bookings[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Profile
      .addCase(getUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload.user;
        state.error = null;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = { ...state.profile, ...action.payload.user };
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Upload Profile Picture
      .addCase(uploadProfilePicture.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadProfilePicture.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.profile) {
          state.profile.profilePicture = action.payload.profilePicture;
        }
        state.error = null;
      })
      .addCase(uploadProfilePicture.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Bookings
      .addCase(getUserBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload.bookings;
        state.bookingsPagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(getUserBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Booking Details
      .addCase(getBookingDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBookingDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBooking = action.payload.booking;
        state.error = null;
      })
      .addCase(getBookingDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Cancel Booking
      .addCase(cancelBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        const bookingIndex = state.bookings.findIndex(
          (booking) => booking.id === action.payload.bookingId
        );
        if (bookingIndex !== -1) {
          state.bookings[bookingIndex] = action.payload.booking;
        }
        if (state.currentBooking && state.currentBooking.id === action.payload.bookingId) {
          state.currentBooking = action.payload.booking;
        }
        state.error = null;
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Preferences
      .addCase(getUserPreferences.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserPreferences.fulfilled, (state, action) => {
        state.isLoading = false;
        state.preferences = { ...state.preferences, ...action.payload.preferences };
        state.error = null;
      })
      .addCase(getUserPreferences.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Preferences
      .addCase(updateUserPreferences.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserPreferences.fulfilled, (state, action) => {
        state.isLoading = false;
        state.preferences = { ...state.preferences, ...action.payload.preferences };
        state.error = null;
      })
      .addCase(updateUserPreferences.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const {
  clearError,
  clearCurrentBooking,
  updateLocalPreferences,
  addBookingToList,
  updateBookingInList,
} = userSlice.actions;

// Export reducer
export default userSlice.reducer;

// Export selectors
export const selectUserProfile = (state) => state.user.profile;
export const selectUserBookings = (state) => state.user.bookings;
export const selectCurrentBooking = (state) => state.user.currentBooking;
export const selectUserPreferences = (state) => state.user.preferences;
export const selectUserLoading = (state) => state.user.isLoading;
export const selectUserError = (state) => state.user.error;
export const selectBookingsPagination = (state) => state.user.bookingsPagination;
