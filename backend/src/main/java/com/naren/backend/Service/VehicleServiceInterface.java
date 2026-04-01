package com.naren.backend.Service;

import com.naren.backend.DTO.VehicleResponse;
import com.naren.backend.Record.VehicleRequest;

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
}
