package com.naren.backend.Service;

import com.naren.backend.DTO.LocationResponse;
import com.naren.backend.Record.LocationRequest;

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
}
