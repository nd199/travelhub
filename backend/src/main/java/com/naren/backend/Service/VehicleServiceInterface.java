package com.naren.backend.service;

import com.naren.backend.dto.VehicleResponse;
import com.naren.backend.record.VehicleRequest;

import java.time.LocalDateTime;
import java.util.List;

public interface VehicleServiceInterface {
    VehicleResponse createVehicle(VehicleRequest vehicleRequest);
    VehicleResponse getVehicleById(String id);
    VehicleResponse getVehicleByRegistrationNumber(String registrationNumber);
    List<VehicleResponse> getAllVehicles();
    List<VehicleResponse> getVehiclesByType(String type);
    List<VehicleResponse> getVehiclesByStatus(String status);
    VehicleResponse updateVehicle(String id, VehicleRequest vehicleRequest);
    void deleteVehicle(String id);
    
    List<VehicleResponse> getVehiclesByTypeAndStatus(String type, String status);
    List<VehicleResponse> getVehiclesByCapacityRange(int minCapacity, int maxCapacity);
    List<VehicleResponse> getVehiclesByAmenitiesContaining(String amenity);
    List<VehicleResponse> getAvailableVehicles(LocalDateTime startTime, LocalDateTime endTime);
    List<VehicleResponse> getVehiclesByTypeAndCapacityGreaterThan(String type, int minCapacity);
    Long getVehicleCountByType(String type);
    Long getVehicleCountByStatus(String status);
    List<VehicleResponse> getVehiclesByNameContaining(String name);
    List<VehicleResponse> getAvailableVehiclesInTimeRange(LocalDateTime start, LocalDateTime end);
    Long getVehicleCountByTypeAndStatus(String type, String status);
}
