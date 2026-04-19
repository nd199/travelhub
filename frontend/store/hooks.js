import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  loginUser,
  registerUser,
  logoutUser,
  refreshToken,
  verifyToken,
  clearError as clearAuthError,
  updateUser as updateAuthUser,
} from './slices/authSlice';
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  uploadProfilePicture,
  getUserBookings,
  getBookingDetails,
  cancelBooking,
  getUserPreferences,
  updateUserPreferences,
  clearError as clearUserError,
} from './slices/userSlice';
import {
  searchFlights,
  searchTrains,
  getFlightDetails,
  getTrainDetails,
  getFlightSeatMap,
  getTrainSeatMap,
  reserveSeats,
  createBooking,
  processPayment,
  getBookingConfirmation,
  clearError as clearBookingError,
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
} from './slices/bookingSlice';
import {
  getPopularFlights,
  getFlightDeals,
  getAirlines,
  getAirports,
  getFlightRoutes,
  getFlightPriceCalendar,
  getFlightPriceTrends,
  subscribeFlightAlert,
  getFlightReviews,
  submitFlightReview,
  clearError as clearFlightError,
  clearAirports,
  clearRoutes,
  clearPriceCalendar,
  clearPriceTrends,
  addFlightAlert,
  removeFlightAlert,
} from './slices/flightSlice';
import {
  getPopularTrains,
  getTrainDeals,
  getTrainStations,
  getTrainRoutes,
  getTrainSchedule,
  getTrainLiveStatus,
  getTrainPriceCalendar,
  subscribeTrainAlert,
  getTrainReviews,
  submitTrainReview,
  getTrainCoachLayout,
  getTrainAmenities,
  getTrainPantryMenu,
  clearError as clearTrainError,
  clearStations,
  clearPriceCalendar as clearTrainPriceCalendar,
  addTrainAlert,
  removeTrainAlert,
  updateLiveStatus,
} from './slices/trainSlice';
import {
  selectAuth,
  selectIsAuthenticated,
  selectUser,
  selectAuthLoading,
  selectAuthError,
} from './slices/authSlice';
import {
  selectUserProfile,
  selectUserBookings,
  selectCurrentBooking,
  selectUserPreferences,
  selectUserLoading,
  selectUserError,
  selectBookingsPagination,
} from './slices/userSlice';
import {
  selectFlightSearch,
  selectTrainSearch,
  selectCurrentSelection,
  selectSeatMaps,
  selectBooking,
  selectRecentSearches,
} from './slices/bookingSlice';
import {
  selectPopularFlights,
  selectFlightDeals,
  selectAirlines,
  selectAirports,
  selectFlightRoutes,
  selectPriceCalendar,
  selectPriceTrends,
  selectFlightReviews,
  selectFlightAlerts,
} from './slices/flightSlice';
import {
  selectPopularTrains,
  selectTrainDeals,
  selectTrainStations,
  selectTrainRoutes,
  selectTrainSchedule,
  selectTrainLiveStatus,
  selectTrainPriceCalendar,
  selectTrainReviews,
  selectTrainCoachLayout,
  selectTrainAmenities,
  selectTrainPantryMenu,
  selectTrainAlerts,
} from './slices/trainSlice';

// Typed hooks
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// Auth hooks
export const useAuth = () => {
  const auth = useAppSelector(selectAuth);
  return auth;
};

export const useIsAuthenticated = () => {
  return useAppSelector(selectIsAuthenticated);
};

export const useAuthUser = () => {
  return useAppSelector(selectUser);
};

export const useAuthLoading = () => {
  return useAppSelector(selectAuthLoading);
};

export const useAuthError = () => {
  return useAppSelector(selectAuthError);
};

// User hooks
export const useUserProfile = () => {
  return useAppSelector(selectUserProfile);
};

export const useUserBookings = () => {
  return useAppSelector(selectUserBookings);
};

export const useCurrentBooking = () => {
  return useAppSelector(selectCurrentBooking);
};

export const useUserPreferences = () => {
  return useAppSelector(selectUserPreferences);
};

export const useUserLoading = () => {
  return useAppSelector(selectUserLoading);
};

export const useUserError = () => {
  return useAppSelector(selectUserError);
};

export const useBookingsPagination = () => {
  return useAppSelector(selectBookingsPagination);
};

// Booking hooks
export const useFlightSearch = () => {
  return useAppSelector(selectFlightSearch);
};

export const useTrainSearch = () => {
  return useAppSelector(selectTrainSearch);
};

export const useCurrentSelection = () => {
  return useAppSelector(selectCurrentSelection);
};

export const useSeatMaps = () => {
  return useAppSelector(selectSeatMaps);
};

export const useBooking = () => {
  return useAppSelector(selectBooking);
};

export const useRecentSearches = () => {
  return useAppSelector(selectRecentSearches);
};

// Flight hooks
export const usePopularFlights = () => {
  return useAppSelector(selectPopularFlights);
};

export const useFlightDeals = () => {
  return useAppSelector(selectFlightDeals);
};

export const useAirlines = () => {
  return useAppSelector(selectAirlines);
};

export const useAirports = () => {
  return useAppSelector(selectAirports);
};

export const useFlightRoutes = () => {
  return useAppSelector(selectFlightRoutes);
};

export const useFlightPriceCalendar = () => {
  return useAppSelector(selectPriceCalendar);
};

export const useFlightPriceTrends = () => {
  return useAppSelector(selectPriceTrends);
};

export const useFlightReviews = (flightId) => {
  return useAppSelector((state) => selectFlightReviews(state, flightId));
};

export const useFlightAlerts = () => {
  return useAppSelector(selectFlightAlerts);
};

// Train hooks
export const usePopularTrains = () => {
  return useAppSelector(selectPopularTrains);
};

export const useTrainDeals = () => {
  return useAppSelector(selectTrainDeals);
};

export const useTrainStations = () => {
  return useAppSelector(selectTrainStations);
};

export const useTrainRoutes = () => {
  return useAppSelector(selectTrainRoutes);
};

export const useTrainSchedule = (trainNumber, date) => {
  return useAppSelector((state) => selectTrainSchedule(state, trainNumber, date));
};

export const useTrainLiveStatus = (trainNumber, date) => {
  return useAppSelector((state) => selectTrainLiveStatus(state, trainNumber, date));
};

export const useTrainPriceCalendar = () => {
  return useAppSelector(selectTrainPriceCalendar);
};

export const useTrainReviews = (trainNumber) => {
  return useAppSelector((state) => selectTrainReviews(state, trainNumber));
};

export const useTrainCoachLayout = (trainNumber, coachType) => {
  return useAppSelector((state) => selectTrainCoachLayout(state, trainNumber, coachType));
};

export const useTrainAmenities = (trainNumber) => {
  return useAppSelector((state) => selectTrainAmenities(state, trainNumber));
};

export const useTrainPantryMenu = (trainNumber) => {
  return useAppSelector((state) => selectTrainPantryMenu(state, trainNumber));
};

export const useTrainAlerts = () => {
  return useAppSelector(selectTrainAlerts);
};

// Combined hooks for common use cases
export const useAuthState = () => {
  const isAuthenticated = useIsAuthenticated();
  const user = useAuthUser();
  const isLoading = useAuthLoading();
  const error = useAuthError();
  
  return {
    isAuthenticated,
    user,
    isLoading,
    error,
  };
};

export const useBookingState = () => {
  const currentSelection = useCurrentSelection();
  const booking = useBooking();
  const seatMaps = useSeatMaps();
  
  return {
    currentSelection,
    booking,
    seatMaps,
  };
};

export const useSearchState = () => {
  const flightSearch = useFlightSearch();
  const trainSearch = useTrainSearch();
  const recentSearches = useRecentSearches();
  
  return {
    flightSearch,
    trainSearch,
    recentSearches,
  };
};

// Action dispatch hooks
export const useAuthActions = () => {
  const dispatch = useAppDispatch();
  
  return {
    login: useCallback((credentials) => dispatch(loginUser(credentials)), [dispatch]),
    register: useCallback((userData) => dispatch(registerUser(userData)), [dispatch]),
    logout: useCallback(() => dispatch(logoutUser()), [dispatch]),
    refreshToken: useCallback(() => dispatch(refreshToken()), [dispatch]),
    verifyToken: useCallback(() => dispatch(verifyToken()), [dispatch]),
    clearError: useCallback(() => dispatch(clearAuthError()), [dispatch]),
    updateUser: useCallback((userData) => dispatch(updateAuthUser(userData)), [dispatch]),
  };
};

export const useUserActions = () => {
  const dispatch = useAppDispatch();
  
  return {
    getUserProfile: useCallback(() => dispatch(getUserProfile()), [dispatch]),
    updateUserProfile: useCallback((userData) => dispatch(updateUserProfile(userData)), [dispatch]),
    changePassword: useCallback((passwords) => dispatch(changePassword(passwords)), [dispatch]),
    uploadProfilePicture: useCallback((formData) => dispatch(uploadProfilePicture(formData)), [dispatch]),
    getUserBookings: useCallback((params) => dispatch(getUserBookings(params)), [dispatch]),
    getBookingDetails: useCallback((bookingId) => dispatch(getBookingDetails(bookingId)), [dispatch]),
    cancelBooking: useCallback((bookingId) => dispatch(cancelBooking(bookingId)), [dispatch]),
    getUserPreferences: useCallback(() => dispatch(getUserPreferences()), [dispatch]),
    updateUserPreferences: useCallback((preferences) => dispatch(updateUserPreferences(preferences)), [dispatch]),
    clearError: useCallback(() => dispatch(clearUserError()), [dispatch]),
  };
};

export const useBookingActions = () => {
  const dispatch = useAppDispatch();
  
  return {
    searchFlights: useCallback((params) => dispatch(searchFlights(params)), [dispatch]),
    searchTrains: useCallback((params) => dispatch(searchTrains(params)), [dispatch]),
    getFlightDetails: useCallback((flightId) => dispatch(getFlightDetails(flightId)), [dispatch]),
    getTrainDetails: useCallback((trainId) => dispatch(getTrainDetails(trainId)), [dispatch]),
    getFlightSeatMap: useCallback((params) => dispatch(getFlightSeatMap(params)), [dispatch]),
    getTrainSeatMap: useCallback((params) => dispatch(getTrainSeatMap(params)), [dispatch]),
    reserveSeats: useCallback(params => dispatch(reserveSeats(params)), [dispatch]),
    createBooking: useCallback((bookingData) => dispatch(createBooking(bookingData)), [dispatch]),
    processPayment: useCallback(params => dispatch(processPayment(params)), [dispatch]),
    getBookingConfirmation: useCallback((bookingId) => dispatch(getBookingConfirmation(bookingId)), [dispatch]),
    clearError: useCallback(() => dispatch(clearBookingError()), [dispatch]),
    setCurrentSelection: useCallback((selection) => dispatch(setCurrentSelection(selection)), [dispatch]),
    clearCurrentSelection: useCallback(() => dispatch(clearCurrentSelection()), [dispatch]),
    updateFlightFilters: useCallback((filters) => dispatch(updateFlightFilters(filters)), [dispatch]),
    updateTrainFilters: useCallback((filters) => dispatch(updateTrainFilters(filters)), [dispatch]),
    addPassenger: useCallback((passenger) => dispatch(addPassenger(passenger)), [dispatch]),
    updatePassenger: useCallback((params) => dispatch(updatePassenger(params)), [dispatch]),
    removePassenger: useCallback((index) => dispatch(removePassenger(index)), [dispatch]),
    toggleSeatSelection: useCallback((seat) => dispatch(toggleSeatSelection(seat)), [dispatch]),
    clearSeatSelection: useCallback(() => dispatch(clearSeatSelection()), [dispatch]),
    addRecentSearch: useCallback((search) => dispatch(addRecentSearch(search)), [dispatch]),
    clearSeatMaps: useCallback(() => dispatch(clearSeatMaps()), [dispatch]),
    resetBooking: useCallback(() => dispatch(resetBooking()), [dispatch]),
  };
};

export const useFlightActions = () => {
  const dispatch = useAppDispatch();
  
  return {
    getPopularFlights: useCallback(() => dispatch(getPopularFlights()), [dispatch]),
    getFlightDeals: useCallback(() => dispatch(getFlightDeals()), [dispatch]),
    getAirlines: useCallback(() => dispatch(getAirlines()), [dispatch]),
    getAirports: useCallback((search) => dispatch(getAirports(search)), [dispatch]),
    getFlightRoutes: useCallback((params) => dispatch(getFlightRoutes(params)), [dispatch]),
    getFlightPriceCalendar: useCallback((params) => dispatch(getFlightPriceCalendar(params)), [dispatch]),
    getFlightPriceTrends: useCallback((params) => dispatch(getFlightPriceTrends(params)), [dispatch]),
    subscribeFlightAlert: useCallback((alertData) => dispatch(subscribeFlightAlert(alertData)), [dispatch]),
    getFlightReviews: useCallback((params) => dispatch(getFlightReviews(params)), [dispatch]),
    submitFlightReview: useCallback((reviewData) => dispatch(submitFlightReview(reviewData)), [dispatch]),
    clearError: useCallback(() => dispatch(clearFlightError()), [dispatch]),
    clearAirports: useCallback(() => dispatch(clearAirports()), [dispatch]),
    clearRoutes: useCallback(() => dispatch(clearRoutes()), [dispatch]),
    clearPriceCalendar: useCallback(() => dispatch(clearPriceCalendar()), [dispatch]),
    clearPriceTrends: useCallback(() => dispatch(clearPriceTrends()), [dispatch]),
    addFlightAlert: useCallback((alert) => dispatch(addFlightAlert(alert)), [dispatch]),
    removeFlightAlert: useCallback((alertId) => dispatch(removeFlightAlert(alertId)), [dispatch]),
  };
};

export const useTrainActions = () => {
  const dispatch = useAppDispatch();
  
  return {
    getPopularTrains: useCallback(() => dispatch(getPopularTrains()), [dispatch]),
    getTrainDeals: useCallback(() => dispatch(getTrainDeals()), [dispatch]),
    getTrainStations: useCallback((search) => dispatch(getTrainStations(search)), [dispatch]),
    getTrainRoutes: useCallback((params) => dispatch(getTrainRoutes(params)), [dispatch]),
    getTrainSchedule: useCallback((params) => dispatch(getTrainSchedule(params)), [dispatch]),
    getTrainLiveStatus: useCallback((params) => dispatch(getTrainLiveStatus(params)), [dispatch]),
    getTrainPriceCalendar: useCallback((params) => dispatch(getTrainPriceCalendar(params)), [dispatch]),
    subscribeTrainAlert: useCallback((alertData) => dispatch(subscribeTrainAlert(alertData)), [dispatch]),
    getTrainReviews: useCallback((params) => dispatch(getTrainReviews(params)), [dispatch]),
    submitTrainReview: useCallback((reviewData) => dispatch(submitTrainReview(reviewData)), [dispatch]),
    getTrainCoachLayout: useCallback((params) => dispatch(getTrainCoachLayout(params)), [dispatch]),
    getTrainAmenities: useCallback((params) => dispatch(getTrainAmenities(params)), [dispatch]),
    getTrainPantryMenu: useCallback((params) => dispatch(getTrainPantryMenu(params)), [dispatch]),
    clearError: useCallback(() => dispatch(clearTrainError()), [dispatch]),
    clearStations: useCallback(() => dispatch(clearStations()), [dispatch]),
    clearRoutes: useCallback(() => dispatch(clearRoutes()), [dispatch]),
    clearPriceCalendar: useCallback(() => dispatch(clearTrainPriceCalendar()), [dispatch]),
    addTrainAlert: useCallback((alert) => dispatch(addTrainAlert(alert)), [dispatch]),
    removeTrainAlert: useCallback((alertId) => dispatch(removeTrainAlert(alertId)), [dispatch]),
    updateLiveStatus: useCallback((statusData) => dispatch(updateLiveStatus(statusData)), [dispatch]),
  };
};
