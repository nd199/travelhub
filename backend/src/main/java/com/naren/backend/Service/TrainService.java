package com.naren.backend.service;

import com.naren.backend.record.TrainSearchRequest;
import com.naren.backend.record.TrainSearchResponse;
import com.naren.backend.record.TrainAlertRequest;
import com.naren.backend.record.TrainReviewRequest;
import java.util.List;

public interface TrainService {
    
    List<TrainSearchResponse> searchTrains(TrainSearchRequest request);
    
    TrainSearchResponse getTrainDetails(Long trainId);
    
    List<Object> getTrainSeatMap(Long trainId);
    
    List<TrainSearchResponse> getPopularTrains();
    
    List<TrainSearchResponse> getTrainDeals();
    
    List<Object> getTrainStations();
    
    List<Object> getTrainRoutes();
    
    List<Object> getTrainSchedule(String trainNumber, String date);
    
    Object getTrainLiveStatus(String trainNumber);
    
    List<Object> getTrainPriceCalendar(String origin, String destination, String date);
    
    void subscribeTrainAlert(TrainAlertRequest request);
    
    List<Object> getTrainReviews(Long trainId);
    
    void submitTrainReview(Long trainId, TrainReviewRequest request);
    
    List<Object> getTrainCoachLayout(Long trainId, String coachClass);
    
    List<Object> getTrainAmenities(Long trainId);
    
    List<Object> getTrainPantryMenu(Long trainId);
}