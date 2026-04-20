package com.naren.backend.service;

import com.naren.backend.dto.LocationRequest;
import com.naren.backend.dto.LocationResponse;

import java.util.List;

public interface LocationService {
    
    LocationResponse createLocation(LocationRequest request);
    
    LocationResponse getLocationById(String id);
    
    List<LocationResponse> getAllLocations();
    
    List<LocationResponse> getLocationsByType(String type);
    
    List<LocationResponse> getLocationsByCity(String city);
    
    List<LocationResponse> getLocationsByCountry(String country);
    
    List<LocationResponse> getLocationsByState(String state);
    
    List<LocationResponse> getLocationsByCityAndType(String city, String type);
    
    Long getLocationCountByType(String type);
    
    LocationResponse updateLocation(String id, LocationRequest request);
    
    void deleteLocation(String id);
}
