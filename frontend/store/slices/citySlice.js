import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Async thunk for cities
export const fetchCities = createAsyncThunk(
  'city/fetchCities',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/locations');
      const cities = [
        ...new Set(response.data.map((location) => location.city)),
      ];
      return cities.sort();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch cities'
      );
    }
  }
);

// Initial state
const initialState = {
  cities: [],
  loading: false,
  error: null,
};

// Create slice
const citySlice = createSlice({
  name: 'city',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cities
      .addCase(fetchCities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.loading = false;
        state.cities = action.payload;
        state.error = null;
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.cities = [];
      });
  },
});

// Export actions
export const { clearError } = citySlice.actions;

// Export reducer
export default citySlice.reducer;
