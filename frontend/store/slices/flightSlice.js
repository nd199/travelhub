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
export const getPopularFlights = createAsyncThunk(
  'flight/getPopularFlights',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/flights/popular');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch popular flights'
      );
    }
  }
);

export const getFlightDeals = createAsyncThunk(
  'flight/getFlightDeals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/flights/deals');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch flight deals'
      );
    }
  }
);

export const getAirlines = createAsyncThunk(
  'flight/getAirlines',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/flights/airlines');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch airlines'
      );
    }
  }
);

export const getAirports = createAsyncThunk(
  'flight/getAirports',
  async ({ search = '' }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/flights/airports?search=${search}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch airports'
      );
    }
  }
);

export const getFlightRoutes = createAsyncThunk(
  'flight/getFlightRoutes',
  async ({ from, to }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/flights/routes?from=${from}&to=${to}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch flight routes'
      );
    }
  }
);

export const getFlightPriceCalendar = createAsyncThunk(
  'flight/getFlightPriceCalendar',
  async ({ from, to, month }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/flights/price-calendar?from=${from}&to=${to}&month=${month}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch price calendar'
      );
    }
  }
);

export const getFlightPriceTrends = createAsyncThunk(
  'flight/getFlightPriceTrends',
  async ({ from, to, days = 30 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/flights/price-trends?from=${from}&to=${to}&days=${days}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch price trends'
      );
    }
  }
);

export const subscribeFlightAlert = createAsyncThunk(
  'flight/subscribeFlightAlert',
  async ({ from, to, date, maxPrice }, { rejectWithValue }) => {
    try {
      const response = await api.post('/flights/alerts', {
        from,
        to,
        date,
        maxPrice,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to subscribe to flight alert'
      );
    }
  }
);

export const getFlightReviews = createAsyncThunk(
  'flight/getFlightReviews',
  async ({ flightId, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/flights/${flightId}/reviews?page=${page}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch flight reviews'
      );
    }
  }
);

export const submitFlightReview = createAsyncThunk(
  'flight/submitFlightReview',
  async ({ flightId, rating, comment }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/flights/${flightId}/reviews`, {
        rating,
        comment,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to submit flight review'
      );
    }
  }
);

// Initial state
const initialState = {
  popularFlights: {
    domestic: [],
    international: [],
    isLoading: false,
    error: null,
  },
  deals: {
    featured: [],
    lastMinute: [],
    isLoading: false,
    error: null,
  },
  airlines: [],
  airports: [],
  routes: [],
  priceCalendar: null,
  priceTrends: null,
  reviews: {
    [flightId]: {
      reviews: [],
      pagination: null,
      isLoading: false,
      error: null,
    },
  },
  alerts: [],
  isLoading: false,
  error: null,
};

// Slice
const flightSlice = createSlice({
  name: 'flight',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.popularFlights.error = null;
      state.deals.error = null;
    },
    clearAirports: (state) => {
      state.airports = [];
    },
    clearRoutes: (state) => {
      state.routes = [];
    },
    clearPriceCalendar: (state) => {
      state.priceCalendar = null;
    },
    clearPriceTrends: (state) => {
      state.priceTrends = null;
    },
    addFlightAlert: (state, action) => {
      state.alerts.push(action.payload);
    },
    removeFlightAlert: (state, action) => {
      const alertId = action.payload;
      state.alerts = state.alerts.filter((alert) => alert.id !== alertId);
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Popular Flights
      .addCase(getPopularFlights.pending, (state) => {
        state.popularFlights.isLoading = true;
        state.popularFlights.error = null;
      })
      .addCase(getPopularFlights.fulfilled, (state, action) => {
        state.popularFlights.isLoading = false;
        state.popularFlights.domestic = action.payload.domestic;
        state.popularFlights.international = action.payload.international;
        state.popularFlights.error = null;
      })
      .addCase(getPopularFlights.rejected, (state, action) => {
        state.popularFlights.isLoading = false;
        state.popularFlights.error = action.payload;
      })
      // Get Flight Deals
      .addCase(getFlightDeals.pending, (state) => {
        state.deals.isLoading = true;
        state.deals.error = null;
      })
      .addCase(getFlightDeals.fulfilled, (state, action) => {
        state.deals.isLoading = false;
        state.deals.featured = action.payload.featured;
        state.deals.lastMinute = action.payload.lastMinute;
        state.deals.error = null;
      })
      .addCase(getFlightDeals.rejected, (state, action) => {
        state.deals.isLoading = false;
        state.deals.error = action.payload;
      })
      // Get Airlines
      .addCase(getAirlines.fulfilled, (state, action) => {
        state.airlines = action.payload.airlines;
      })
      .addCase(getAirlines.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Get Airports
      .addCase(getAirports.fulfilled, (state, action) => {
        state.airports = action.payload.airports;
      })
      .addCase(getAirports.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Get Flight Routes
      .addCase(getFlightRoutes.fulfilled, (state, action) => {
        state.routes = action.payload.routes;
      })
      .addCase(getFlightRoutes.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Get Flight Price Calendar
      .addCase(getFlightPriceCalendar.fulfilled, (state, action) => {
        state.priceCalendar = action.payload.calendar;
      })
      .addCase(getFlightPriceCalendar.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Get Flight Price Trends
      .addCase(getFlightPriceTrends.fulfilled, (state, action) => {
        state.priceTrends = action.payload.trends;
      })
      .addCase(getFlightPriceTrends.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Subscribe Flight Alert
      .addCase(subscribeFlightAlert.fulfilled, (state, action) => {
        state.alerts.push(action.payload.alert);
      })
      .addCase(subscribeFlightAlert.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Get Flight Reviews
      .addCase(getFlightReviews.pending, (state, action) => {
        const flightId = action.meta.arg;
        if (!state.reviews[flightId]) {
          state.reviews[flightId] = {
            reviews: [],
            pagination: null,
            isLoading: true,
            error: null,
          };
        } else {
          state.reviews[flightId].isLoading = true;
          state.reviews[flightId].error = null;
        }
      })
      .addCase(getFlightReviews.fulfilled, (state, action) => {
        const flightId = action.meta.arg;
        state.reviews[flightId] = {
          reviews: action.payload.reviews,
          pagination: action.payload.pagination,
          isLoading: false,
          error: null,
        };
      })
      .addCase(getFlightReviews.rejected, (state, action) => {
        const flightId = action.meta.arg;
        if (!state.reviews[flightId]) {
          state.reviews[flightId] = {
            reviews: [],
            pagination: null,
            isLoading: false,
            error: action.payload,
          };
        } else {
          state.reviews[flightId].isLoading = false;
          state.reviews[flightId].error = action.payload;
        }
      })
      // Submit Flight Review
      .addCase(submitFlightReview.fulfilled, (state, action) => {
        const flightId = action.meta.arg.flightId;
        if (state.reviews[flightId]) {
          state.reviews[flightId].reviews.unshift(action.payload.review);
        }
      })
      .addCase(submitFlightReview.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// Export actions
export const {
  clearError,
  clearAirports,
  clearRoutes,
  clearPriceCalendar,
  clearPriceTrends,
  addFlightAlert,
  removeFlightAlert,
} = flightSlice.actions;

// Export reducer
export default flightSlice.reducer;

// Export selectors
export const selectPopularFlights = (state) => state.flight.popularFlights;
export const selectFlightDeals = (state) => state.flight.deals;
export const selectAirlines = (state) => state.flight.airlines;
export const selectAirports = (state) => state.flight.airports;
export const selectFlightRoutes = (state) => state.flight.routes;
export const selectPriceCalendar = (state) => state.flight.priceCalendar;
export const selectPriceTrends = (state) => state.flight.priceTrends;
export const selectFlightReviews = (state, flightId) => state.flight.reviews[flightId];
export const selectFlightAlerts = (state) => state.flight.alerts;
