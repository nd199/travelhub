package com.naren.backend.service;

import com.naren.backend.dto.VehicleRequest;
import com.naren.backend.dto.VehicleResponse;

import java.util.List;

public interface VehicleService {
    
    VehicleResponse createVehicle(VehicleRequest request);
    
    VehicleResponse getVehicleById(String id);
    
    List<VehicleResponse> getAllVehicles();
    
    List<VehicleResponse> getVehiclesByType(String type);
    
    List<VehicleResponse> getVehiclesByStatus(String status);
    
    VehicleResponse updateVehicle(String id, VehicleRequest request);
    
    void deleteVehicle(String id);
}
