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
export const getPopularTrains = createAsyncThunk(
  'train/getPopularTrains',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/trains/popular');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch popular trains'
      );
    }
  }
);

export const getTrainDeals = createAsyncThunk(
  'train/getTrainDeals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/trains/deals');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch train deals'
      );
    }
  }
);

export const getTrainStations = createAsyncThunk(
  'train/getTrainStations',
  async ({ search = '' }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/trains/stations?search=${search}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch train stations'
      );
    }
  }
);

export const getTrainRoutes = createAsyncThunk(
  'train/getTrainRoutes',
  async ({ from, to }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/trains/routes?from=${from}&to=${to}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch train routes'
      );
    }
  }
);

export const getTrainSchedule = createAsyncThunk(
  'train/getTrainSchedule',
  async ({ trainNumber, date }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/trains/${trainNumber}/schedule?date=${date}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch train schedule'
      );
    }
  }
);

export const getTrainLiveStatus = createAsyncThunk(
  'train/getTrainLiveStatus',
  async ({ trainNumber, date }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/trains/${trainNumber}/live-status?date=${date}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch train live status'
      );
    }
  }
);

export const getTrainPriceCalendar = createAsyncThunk(
  'train/getTrainPriceCalendar',
  async ({ from, to, month, classType }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/trains/price-calendar?from=${from}&to=${to}&month=${month}&class=${classType}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch price calendar'
      );
    }
  }
);

export const subscribeTrainAlert = createAsyncThunk(
  'train/subscribeTrainAlert',
  async ({ from, to, date, trainNumber, maxPrice }, { rejectWithValue }) => {
    try {
      const response = await api.post('/trains/alerts', {
        from,
        to,
        date,
        trainNumber,
        maxPrice,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to subscribe to train alert'
      );
    }
  }
);

export const getTrainReviews = createAsyncThunk(
  'train/getTrainReviews',
  async ({ trainNumber, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/trains/${trainNumber}/reviews?page=${page}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch train reviews'
      );
    }
  }
);

export const submitTrainReview = createAsyncThunk(
  'train/submitTrainReview',
  async ({ trainNumber, rating, comment }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/trains/${trainNumber}/reviews`, {
        rating,
        comment,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to submit train review'
      );
    }
  }
);

export const getTrainCoachLayout = createAsyncThunk(
  'train/getTrainCoachLayout',
  async ({ trainNumber, coachType }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/trains/${trainNumber}/coach-layout?coach=${coachType}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch coach layout'
      );
    }
  }
);

export const getTrainAmenities = createAsyncThunk(
  'train/getTrainAmenities',
  async ({ trainNumber }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/trains/${trainNumber}/amenities`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch train amenities'
      );
    }
  }
);

export const getTrainPantryMenu = createAsyncThunk(
  'train/getTrainPantryMenu',
  async ({ trainNumber }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/trains/${trainNumber}/pantry-menu`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch pantry menu'
      );
    }
  }
);

// Initial state
const initialState = {
  popularTrains: {
    express: [],
    superfast: [],
    passenger: [],
    isLoading: false,
    error: null,
  },
  deals: {
    tatkal: [],
    premium: [],
    isLoading: false,
    error: null,
  },
  stations: [],
  routes: [],
  schedules: {},
  liveStatus: {},
  priceCalendar: null,
  reviews: {
    [trainNumber]: {
      reviews: [],
      pagination: null,
      isLoading: false,
      error: null,
    },
  },
  coachLayouts: {},
  amenities: {},
  pantryMenus: {},
  alerts: [],
  isLoading: false,
  error: null,
};

// Slice
const trainSlice = createSlice({
  name: 'train',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.popularTrains.error = null;
      state.deals.error = null;
    },
    clearStations: (state) => {
      state.stations = [];
    },
    clearRoutes: (state) => {
      state.routes = [];
    },
    clearPriceCalendar: (state) => {
      state.priceCalendar = null;
    },
    addTrainAlert: (state, action) => {
      state.alerts.push(action.payload);
    },
    removeTrainAlert: (state, action) => {
      const alertId = action.payload;
      state.alerts = state.alerts.filter((alert) => alert.id !== alertId);
    },
    updateLiveStatus: (state, action) => {
      const { trainNumber, status } = action.payload;
      state.liveStatus[trainNumber] = status;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Popular Trains
      .addCase(getPopularTrains.pending, (state) => {
        state.popularTrains.isLoading = true;
        state.popularTrains.error = null;
      })
      .addCase(getPopularTrains.fulfilled, (state, action) => {
        state.popularTrains.isLoading = false;
        state.popularTrains.express = action.payload.express;
        state.popularTrains.superfast = action.payload.superfast;
        state.popularTrains.passenger = action.payload.passenger;
        state.popularTrains.error = null;
      })
      .addCase(getPopularTrains.rejected, (state, action) => {
        state.popularTrains.isLoading = false;
        state.popularTrains.error = action.payload;
      })
      // Get Train Deals
      .addCase(getTrainDeals.pending, (state) => {
        state.deals.isLoading = true;
        state.deals.error = null;
      })
      .addCase(getTrainDeals.fulfilled, (state, action) => {
        state.deals.isLoading = false;
        state.deals.tatkal = action.payload.tatkal;
        state.deals.premium = action.payload.premium;
        state.deals.error = null;
      })
      .addCase(getTrainDeals.rejected, (state, action) => {
        state.deals.isLoading = false;
        state.deals.error = action.payload;
      })
      // Get Train Stations
      .addCase(getTrainStations.fulfilled, (state, action) => {
        state.stations = action.payload.stations;
      })
      .addCase(getTrainStations.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Get Train Routes
      .addCase(getTrainRoutes.fulfilled, (state, action) => {
        state.routes = action.payload.routes;
      })
      .addCase(getTrainRoutes.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Get Train Schedule
      .addCase(getTrainSchedule.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTrainSchedule.fulfilled, (state, action) => {
        state.isLoading = false;
        const { trainNumber, date } = action.meta.arg;
        const key = `${trainNumber}-${date}`;
        state.schedules[key] = action.payload.schedule;
        state.error = null;
      })
      .addCase(getTrainSchedule.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Train Live Status
      .addCase(getTrainLiveStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTrainLiveStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const { trainNumber, date } = action.meta.arg;
        const key = `${trainNumber}-${date}`;
        state.liveStatus[key] = action.payload.status;
        state.error = null;
      })
      .addCase(getTrainLiveStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Train Price Calendar
      .addCase(getTrainPriceCalendar.fulfilled, (state, action) => {
        state.priceCalendar = action.payload.calendar;
      })
      .addCase(getTrainPriceCalendar.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Subscribe Train Alert
      .addCase(subscribeTrainAlert.fulfilled, (state, action) => {
        state.alerts.push(action.payload.alert);
      })
      .addCase(subscribeTrainAlert.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Get Train Reviews
      .addCase(getTrainReviews.pending, (state, action) => {
        const trainNumber = action.meta.arg;
        if (!state.reviews[trainNumber]) {
          state.reviews[trainNumber] = {
            reviews: [],
            pagination: null,
            isLoading: true,
            error: null,
          };
        } else {
          state.reviews[trainNumber].isLoading = true;
          state.reviews[trainNumber].error = null;
        }
      })
      .addCase(getTrainReviews.fulfilled, (state, action) => {
        const trainNumber = action.meta.arg;
        state.reviews[trainNumber] = {
          reviews: action.payload.reviews,
          pagination: action.payload.pagination,
          isLoading: false,
          error: null,
        };
      })
      .addCase(getTrainReviews.rejected, (state, action) => {
        const trainNumber = action.meta.arg;
        if (!state.reviews[trainNumber]) {
          state.reviews[trainNumber] = {
            reviews: [],
            pagination: null,
            isLoading: false,
            error: action.payload,
          };
        } else {
          state.reviews[trainNumber].isLoading = false;
          state.reviews[trainNumber].error = action.payload;
        }
      })
      // Submit Train Review
      .addCase(submitTrainReview.fulfilled, (state, action) => {
        const trainNumber = action.meta.arg.trainNumber;
        if (state.reviews[trainNumber]) {
          state.reviews[trainNumber].reviews.unshift(action.payload.review);
        }
      })
      .addCase(submitTrainReview.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Get Train Coach Layout
      .addCase(getTrainCoachLayout.fulfilled, (state, action) => {
        const { trainNumber, coachType } = action.meta.arg;
        const key = `${trainNumber}-${coachType}`;
        state.coachLayouts[key] = action.payload.layout;
      })
      .addCase(getTrainCoachLayout.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Get Train Amenities
      .addCase(getTrainAmenities.fulfilled, (state, action) => {
        const trainNumber = action.meta.arg;
        state.amenities[trainNumber] = action.payload.amenities;
      })
      .addCase(getTrainAmenities.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Get Train Pantry Menu
      .addCase(getTrainPantryMenu.fulfilled, (state, action) => {
        const trainNumber = action.meta.arg;
        state.pantryMenus[trainNumber] = action.payload.menu;
      })
      .addCase(getTrainPantryMenu.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// Export actions
export const {
  clearError,
  clearStations,
  clearRoutes,
  clearPriceCalendar,
  addTrainAlert,
  removeTrainAlert,
  updateLiveStatus,
} = trainSlice.actions;

// Export reducer
export default trainSlice.reducer;

// Export selectors
export const selectPopularTrains = (state) => state.train.popularTrains;
export const selectTrainDeals = (state) => state.train.deals;
export const selectTrainStations = (state) => state.train.stations;
export const selectTrainRoutes = (state) => state.train.routes;
export const selectTrainSchedule = (state, trainNumber, date) => 
  state.train.schedules[`${trainNumber}-${date}`];
export const selectTrainLiveStatus = (state, trainNumber, date) => 
  state.train.liveStatus[`${trainNumber}-${date}`];
export const selectTrainPriceCalendar = (state) => state.train.priceCalendar;
export const selectTrainReviews = (state, trainNumber) => state.train.reviews[trainNumber];
export const selectTrainCoachLayout = (state, trainNumber, coachType) => 
  state.train.coachLayouts[`${trainNumber}-${coachType}`];
export const selectTrainAmenities = (state, trainNumber) => state.train.amenities[trainNumber];
export const selectTrainPantryMenu = (state, trainNumber) => state.train.pantryMenus[trainNumber];
export const selectTrainAlerts = (state) => state.train.alerts;
