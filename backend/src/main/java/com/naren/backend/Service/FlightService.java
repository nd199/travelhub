package com.naren.backend.service;

import com.naren.backend.record.FlightSearchRequest;
import com.naren.backend.record.FlightSearchResponse;
import com.naren.backend.record.FlightAlertRequest;
import com.naren.backend.record.FlightReviewRequest;
import java.util.List;

public interface FlightService {
    
    List<FlightSearchResponse> searchFlights(FlightSearchRequest request);
    
    FlightSearchResponse getFlightDetails(Long flightId);
    
    List<Object> getFlightSeatMap(Long flightId);
    
    List<FlightSearchResponse> getPopularFlights();
    
    List<FlightSearchResponse> getFlightDeals();
    
    List<Object> getAirlines();
    
    List<Object> getAirports();
    
    List<Object> getFlightRoutes();
    
    List<Object> getFlightPriceCalendar(String origin, String destination, String date);
    
    List<Object> getFlightPriceTrends(String origin, String destination);
    
    void subscribeFlightAlert(FlightAlertRequest request);
    
    List<Object> getFlightReviews(Long flightId);
    
    void submitFlightReview(Long flightId, FlightReviewRequest request);
}