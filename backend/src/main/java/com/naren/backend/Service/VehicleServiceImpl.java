package com.naren.backend.service;

import com.naren.backend.dto.VehicleRequest;
import com.naren.backend.dto.VehicleResponse;
import com.naren.backend.entity.Vehicle;
import com.naren.backend.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleServiceImpl(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    @Override
    public VehicleResponse createVehicle(VehicleRequest request) {
        return null; // Simplified implementation
    }

    @Override
    public VehicleResponse getVehicleById(String id) {
        return vehicleRepository.findById(id)
                .map(this::mapToVehicleResponse)
                .orElse(null);
    }

    @Override
    public List<VehicleResponse> getAllVehicles() {
        return vehicleRepository.findAll().stream()
                .map(this::mapToVehicleResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<VehicleResponse> getVehiclesByType(String type) {
        return List.of(); // Simplified implementation
    }

    @Override
    public List<VehicleResponse> getVehiclesByStatus(String status) {
        return List.of(); // Simplified implementation
    }

    @Override
    public VehicleResponse updateVehicle(String id, VehicleRequest request) {
        return null; // Simplified implementation
    }

    @Override
    public void deleteVehicle(String id) {
        vehicleRepository.deleteById(id);
    }

    private VehicleResponse mapToVehicleResponse(Vehicle vehicle) {
        return new VehicleResponse(
                vehicle.getId(),
                vehicle.getName(),
                vehicle.getType().toString(),
                vehicle.getCapacity(),
                vehicle.getAmenities(),
                vehicle.getStatus().toString(),
                vehicle.getRegistrationNumber(),
                vehicle.getCreatedAt(),
                vehicle.getUpdatedAt()
        );
    }
}
