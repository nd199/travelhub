package com.naren.backend.service;

import com.naren.backend.dto.LocationResponse;
import com.naren.backend.record.LocationRequest;

import java.util.List;

public interface LocationServiceInterface {
    LocationResponse createLocation(LocationRequest locationRequest);
    LocationResponse getLocationById(String id);
    List<LocationResponse> getAllLocations();
    List<LocationResponse> getLocationsByCity(String city);
    List<LocationResponse> getLocationsByCountry(String country);
    List<LocationResponse> getLocationsByType(String type);
    List<LocationResponse> getLocationsByCityAndCountry(String city, String country);
    LocationResponse updateLocation(String id, LocationRequest locationRequest);
    void deleteLocation(String id);
    
    List<LocationResponse> getLocationsByState(String state);
    List<LocationResponse> getLocationsByNameContaining(String name);
    List<LocationResponse> getLocationsByPincode(String pincode);
    List<LocationResponse> getLocationsByLatitudeBetween(double minLat, double maxLat);
    List<LocationResponse> getLocationsByLongitudeBetween(double minLng, double maxLng);
    List<LocationResponse> getLocationsByCoordinatesBetween(double minLat, double maxLat, double minLng, double maxLng);
    List<LocationResponse> getLocationsByCityAndType(String city, String type);
    List<LocationResponse> getLocationsByCountryOrderByCity(String country);
    Long getLocationCountByType(String type);
    List<LocationResponse> getNearbyLocations(double latitude, double longitude, double radius);
}
