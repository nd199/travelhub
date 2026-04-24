import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API base URL - updated to use port 8080 for Spring Boot backend
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

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

// Async thunks for buses
export const searchBuses = createAsyncThunk(
  'bus/searchBuses',
  async (searchParams, { rejectWithValue }) => {
    try {
      const { from, to, date } = searchParams;
      const response = await api.get('/buses', {
        params: { from, to, date },
      });
      console.log(response);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to search buses'
      );
    }
  }
);

export const getBusDetails = createAsyncThunk(
  'bus/getBusDetails',
  async (busId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/vehicles/${busId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch bus details'
      );
    }
  }
);

export const getBusSeats = createAsyncThunk(
  'bus/getBusSeats',
  async ({ busId, date }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/vehicles/${busId}/seats`, {
        params: { date },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch bus seats'
      );
    }
  }
);

export const selectBusSeats = createAsyncThunk(
  'bus/selectBusSeats',
  async ({ busId, seatSelection }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/vehicles/${busId}/seats/select`,
        seatSelection
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to select seats'
      );
    }
  }
);

// Initial state
const initialState = {
  buses: [],
  selectedBus: null,
  busSeats: [],
  seatSelection: null,
  loading: false,
  error: null,
  searchParams: null,
};

// Create slice
const busSlice = createSlice({
  name: 'bus',
  initialState,
  reducers: {
    clearBusData: (state) => {
      state.buses = [];
      state.selectedBus = null;
      state.busSeats = [];
      state.seatSelection = null;
      state.error = null;
    },
    setSearchParams: (state, action) => {
      state.searchParams = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Search buses
      .addCase(searchBuses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchBuses.fulfilled, (state, action) => {
        state.loading = false;
        state.buses = action.payload;
        state.error = null;
      })
      .addCase(searchBuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.buses = [];
      })
      // Get bus details
      .addCase(getBusDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBusDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBus = action.payload;
        state.error = null;
      })
      .addCase(getBusDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.selectedBus = null;
      })
      // Get bus seats
      .addCase(getBusSeats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBusSeats.fulfilled, (state, action) => {
        state.loading = false;
        state.busSeats = action.payload;
        state.error = null;
      })
      .addCase(getBusSeats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.busSeats = [];
      })
      // Select seats
      .addCase(selectBusSeats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(selectBusSeats.fulfilled, (state, action) => {
        state.loading = false;
        state.seatSelection = action.payload;
        state.error = null;
      })
      .addCase(selectBusSeats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.seatSelection = null;
      });
  },
});

// Export actions
export const { clearBusData, setSearchParams, clearError } = busSlice.actions;

// Export reducer
export default busSlice.reducer;
