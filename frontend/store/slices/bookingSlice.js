import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API base URL - updated to use port 8080 for Spring Boot backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

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
export const searchFlights = createAsyncThunk(
  'booking/searchFlights',
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await api.post('/flights/search', searchParams);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to search flights'
      );
    }
  }
);

export const searchTrains = createAsyncThunk(
  'booking/searchTrains',
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await api.post('/trains/search', searchParams);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to search trains'
      );
    }
  }
);

export const getFlightDetails = createAsyncThunk(
  'booking/getFlightDetails',
  async (flightId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/flights/${flightId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch flight details'
      );
    }
  }
);

export const getTrainDetails = createAsyncThunk(
  'booking/getTrainDetails',
  async (trainId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/trains/${trainId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch train details'
      );
    }
  }
);

export const getFlightSeatMap = createAsyncThunk(
  'booking/getFlightSeatMap',
  async ({ flightId, classType }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/flights/${flightId}/seat-map?class=${classType}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch seat map'
      );
    }
  }
);

export const getTrainSeatMap = createAsyncThunk(
  'booking/getTrainSeatMap',
  async ({ trainId, classType }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/trains/${trainId}/seat-map?class=${classType}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch seat map'
      );
    }
  }
);

export const reserveSeats = createAsyncThunk(
  'booking/reserveSeats',
  async ({ type, id, seats, classType }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/${type}s/${id}/reserve-seats`, {
        seats,
        classType,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to reserve seats'
      );
    }
  }
);

export const createBooking = createAsyncThunk(
  'booking/createBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create booking'
      );
    }
  }
);

export const processPayment = createAsyncThunk(
  'booking/processPayment',
  async ({ bookingId, paymentData }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/bookings/${bookingId}/payment`, paymentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Payment failed'
      );
    }
  }
);

export const getBookingConfirmation = createAsyncThunk(
  'booking/getBookingConfirmation',
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/bookings/${bookingId}/confirmation`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get booking confirmation'
      );
    }
  }
);

// Initial state
const initialState = {
  // Flight search
  flightSearch: {
    results: [],
    isLoading: false,
    error: null,
    searchParams: null,
    filters: {
      airlines: [],
      priceRange: [0, 50000],
      duration: [0, 24],
      stops: ['Non-stop', '1 Stop', '2+ Stops'],
      departureTime: ['Morning', 'Afternoon', 'Evening', 'Night'],
      arrivalTime: ['Morning', 'Afternoon', 'Evening', 'Night'],
    },
  },
  // Train search
  trainSearch: {
    results: [],
    isLoading: false,
    error: null,
    searchParams: null,
    filters: {
      trainTypes: ['Express', 'Superfast', 'Passenger', 'Mail'],
      classes: ['All Class', 'AC 1st', 'AC 2 Tier', 'AC 3 Tier', 'Sleeper', 'General'],
      departureTime: ['Morning', 'Afternoon', 'Evening', 'Night'],
    },
  },
  // Current selection
  currentSelection: {
    type: null, // 'flight' or 'train'
    item: null,
    classType: null,
    selectedSeats: [],
    passengers: [],
    journeyDetails: null,
  },
  // Seat maps
  seatMaps: {
    flight: null,
    train: null,
    isLoading: false,
    error: null,
  },
  // Booking process
  booking: {
    currentBooking: null,
    reservationId: null,
    isLoading: false,
    error: null,
    paymentStatus: null,
    confirmation: null,
  },
  // Recent searches
  recentSearches: [],
};

// Slice
const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    clearError: (state) => {
      state.flightSearch.error = null;
      state.trainSearch.error = null;
      state.seatMaps.error = null;
      state.booking.error = null;
    },
    setCurrentSelection: (state, action) => {
      state.currentSelection = { ...state.currentSelection, ...action.payload };
    },
    clearCurrentSelection: (state) => {
      state.currentSelection = {
        type: null,
        item: null,
        classType: null,
        selectedSeats: [],
        passengers: [],
        journeyDetails: null,
      };
    },
    updateFlightFilters: (state, action) => {
      state.flightSearch.filters = { ...state.flightSearch.filters, ...action.payload };
    },
    updateTrainFilters: (state, action) => {
      state.trainSearch.filters = { ...state.trainSearch.filters, ...action.payload };
    },
    addPassenger: (state, action) => {
      state.currentSelection.passengers.push(action.payload);
    },
    updatePassenger: (state, action) => {
      const { index, passenger } = action.payload;
      if (state.currentSelection.passengers[index]) {
        state.currentSelection.passengers[index] = {
          ...state.currentSelection.passengers[index],
          ...passenger,
        };
      }
    },
    removePassenger: (state, action) => {
      const index = action.payload;
      state.currentSelection.passengers.splice(index, 1);
    },
    toggleSeatSelection: (state, action) => {
      const seat = action.payload;
      const index = state.currentSelection.selectedSeats.findIndex(
        (selectedSeat) => selectedSeat.id === seat.id
      );
      if (index > -1) {
        state.currentSelection.selectedSeats.splice(index, 1);
      } else {
        state.currentSelection.selectedSeats.push(seat);
      }
    },
    clearSeatSelection: (state) => {
      state.currentSelection.selectedSeats = [];
    },
    addRecentSearch: (state, action) => {
      const search = action.payload;
      const existingIndex = state.recentSearches.findIndex(
        (recent) => JSON.stringify(recent) === JSON.stringify(search)
      );
      if (existingIndex > -1) {
        state.recentSearches.splice(existingIndex, 1);
      }
      state.recentSearches.unshift(search);
      if (state.recentSearches.length > 5) {
        state.recentSearches.pop();
      }
    },
    clearSeatMaps: (state) => {
      state.seatMaps.flight = null;
      state.seatMaps.train = null;
    },
    resetBooking: (state) => {
      state.booking = {
        currentBooking: null,
        reservationId: null,
        isLoading: false,
        error: null,
        paymentStatus: null,
        confirmation: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Search Flights
      .addCase(searchFlights.pending, (state) => {
        state.flightSearch.isLoading = true;
        state.flightSearch.error = null;
      })
      .addCase(searchFlights.fulfilled, (state, action) => {
        state.flightSearch.isLoading = false;
        state.flightSearch.results = action.payload.flights;
        state.flightSearch.searchParams = action.payload.searchParams;
        state.flightSearch.error = null;
      })
      .addCase(searchFlights.rejected, (state, action) => {
        state.flightSearch.isLoading = false;
        state.flightSearch.error = action.payload;
      })
      // Search Trains
      .addCase(searchTrains.pending, (state) => {
        state.trainSearch.isLoading = true;
        state.trainSearch.error = null;
      })
      .addCase(searchTrains.fulfilled, (state, action) => {
        state.trainSearch.isLoading = false;
        state.trainSearch.results = action.payload.trains;
        state.trainSearch.searchParams = action.payload.searchParams;
        state.trainSearch.error = null;
      })
      .addCase(searchTrains.rejected, (state, action) => {
        state.trainSearch.isLoading = false;
        state.trainSearch.error = action.payload;
      })
      // Get Flight Details
      .addCase(getFlightDetails.pending, (state) => {
        state.flightSearch.isLoading = true;
        state.flightSearch.error = null;
      })
      .addCase(getFlightDetails.fulfilled, (state, action) => {
        state.flightSearch.isLoading = false;
        state.currentSelection.item = action.payload.flight;
        state.currentSelection.type = 'flight';
        state.flightSearch.error = null;
      })
      .addCase(getFlightDetails.rejected, (state, action) => {
        state.flightSearch.isLoading = false;
        state.flightSearch.error = action.payload;
      })
      // Get Train Details
      .addCase(getTrainDetails.pending, (state) => {
        state.trainSearch.isLoading = true;
        state.trainSearch.error = null;
      })
      .addCase(getTrainDetails.fulfilled, (state, action) => {
        state.trainSearch.isLoading = false;
        state.currentSelection.item = action.payload.train;
        state.currentSelection.type = 'train';
        state.trainSearch.error = null;
      })
      .addCase(getTrainDetails.rejected, (state, action) => {
        state.trainSearch.isLoading = false;
        state.trainSearch.error = action.payload;
      })
      // Get Flight Seat Map
      .addCase(getFlightSeatMap.pending, (state) => {
        state.seatMaps.isLoading = true;
        state.seatMaps.error = null;
      })
      .addCase(getFlightSeatMap.fulfilled, (state, action) => {
        state.seatMaps.isLoading = false;
        state.seatMaps.flight = action.payload.seatMap;
        state.seatMaps.error = null;
      })
      .addCase(getFlightSeatMap.rejected, (state, action) => {
        state.seatMaps.isLoading = false;
        state.seatMaps.error = action.payload;
      })
      // Get Train Seat Map
      .addCase(getTrainSeatMap.pending, (state) => {
        state.seatMaps.isLoading = true;
        state.seatMaps.error = null;
      })
      .addCase(getTrainSeatMap.fulfilled, (state, action) => {
        state.seatMaps.isLoading = false;
        state.seatMaps.train = action.payload.seatMap;
        state.seatMaps.error = null;
      })
      .addCase(getTrainSeatMap.rejected, (state, action) => {
        state.seatMaps.isLoading = false;
        state.seatMaps.error = action.payload;
      })
      // Reserve Seats
      .addCase(reserveSeats.pending, (state) => {
        state.booking.isLoading = true;
        state.booking.error = null;
      })
      .addCase(reserveSeats.fulfilled, (state, action) => {
        state.booking.isLoading = false;
        state.booking.reservationId = action.payload.reservationId;
        state.booking.error = null;
      })
      .addCase(reserveSeats.rejected, (state, action) => {
        state.booking.isLoading = false;
        state.booking.error = action.payload;
      })
      // Create Booking
      .addCase(createBooking.pending, (state) => {
        state.booking.isLoading = true;
        state.booking.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.booking.isLoading = false;
        state.booking.currentBooking = action.payload.booking;
        state.booking.error = null;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.booking.isLoading = false;
        state.booking.error = action.payload;
      })
      // Process Payment
      .addCase(processPayment.pending, (state) => {
        state.booking.isLoading = true;
        state.booking.error = null;
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.booking.isLoading = false;
        state.booking.paymentStatus = action.payload.status;
        state.booking.error = null;
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.booking.isLoading = false;
        state.booking.paymentStatus = 'failed';
        state.booking.error = action.payload;
      })
      // Get Booking Confirmation
      .addCase(getBookingConfirmation.pending, (state) => {
        state.booking.isLoading = true;
        state.booking.error = null;
      })
      .addCase(getBookingConfirmation.fulfilled, (state, action) => {
        state.booking.isLoading = false;
        state.booking.confirmation = action.payload.confirmation;
        state.booking.error = null;
      })
      .addCase(getBookingConfirmation.rejected, (state, action) => {
        state.booking.isLoading = false;
        state.booking.error = action.payload;
      });
  },
});

// Export actions
export const {
  clearError,
  setCurrentSelection,
  clearCurrentSelection,
  updateFlightFilters,
  updateTrainFilters,
  addPassenger,
  updatePassenger,
  removePassenger,
  toggleSeatSelection,
  clearSeatSelection,
  addRecentSearch,
  clearSeatMaps,
  resetBooking,
} = bookingSlice.actions;

// Export reducer
export default bookingSlice.reducer;

// Export selectors
export const selectFlightSearch = (state) => state.booking.flightSearch;
export const selectTrainSearch = (state) => state.booking.trainSearch;
export const selectCurrentSelection = (state) => state.booking.currentSelection;
export const selectSeatMaps = (state) => state.booking.seatMaps;
export const selectBooking = (state) => state.booking.booking;
export const selectRecentSearches = (state) => state.booking.recentSearches;
