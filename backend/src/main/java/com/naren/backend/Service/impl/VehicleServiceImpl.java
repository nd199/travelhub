package com.naren.backend.Service.impl;

import com.naren.backend.DTO.mapper.VehicleMapper;
import com.naren.backend.Entity.Vehicle;
import com.naren.backend.Entity.VehicleStatus;
import com.naren.backend.Entity.VehicleType;
import com.naren.backend.Exception.ResourceNotFoundException;
import com.naren.backend.Record.VehicleRequest;
import com.naren.backend.DTO.VehicleResponse;
import com.naren.backend.Repo.VehicleRepository;
import com.naren.backend.Service.VehicleServiceInterface;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class VehicleServiceImpl implements VehicleServiceInterface {

    private final VehicleRepository vehicleRepository;
    private final VehicleMapper vehicleMapper;

    public VehicleServiceImpl(VehicleRepository vehicleRepository, VehicleMapper vehicleMapper) {
        this.vehicleRepository = vehicleRepository;
        this.vehicleMapper = vehicleMapper;
    }

    @Override
    public VehicleResponse createVehicle(VehicleRequest vehicleRequest) {
        if(vehicleRepository.existsByRegistrationNumber(vehicleRequest.registrationNumber())) {
            throw new ResourceNotFoundException("Vehicle already exists with registration number: " + vehicleRequest.registrationNumber());
        }

        Vehicle vehicle = Vehicle
                .builder()
                .name(vehicleRequest.name())
                .type(parseVehicleType(vehicleRequest.type()))
                .capacity(vehicleRequest.capacity())
                .amenities(vehicleRequest.amenities())
                .status(parseVehicleStatus(vehicleRequest.status()))
                .registrationNumber(vehicleRequest.registrationNumber())
                .build();

        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return vehicleMapper.apply(savedVehicle);
    }

    @Override
    public VehicleResponse getVehicleById(String id) {
        return vehicleMapper.apply(vehicleRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Vehicle Not Found")
        ));
    }

    @Override
    public VehicleResponse getVehicleByRegistrationNumber(String registrationNumber) {
        return vehicleMapper.apply(vehicleRepository.findByRegistrationNumber(registrationNumber)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Vehicle Not Found")
                ));
    }

    @Override
    public List<VehicleResponse> getAllVehicles() {
        return vehicleRepository.findAll().stream()
                .map(vehicleMapper)
                .toList();
    }

    @Override
    public List<VehicleResponse> getVehiclesByType(String type) {
        VehicleType vehicleType = parseVehicleType(type);
        return vehicleRepository.findByType(vehicleType).stream()
                .map(vehicleMapper)
                .toList();
    }

    @Override
    public List<VehicleResponse> getVehiclesByStatus(String status) {
        VehicleStatus vehicleStatus = parseVehicleStatus(status);
        return vehicleRepository.findByStatus(vehicleStatus).stream()
                .map(vehicleMapper)
                .toList();
    }

    @Override
    public VehicleResponse updateVehicle(String id, VehicleRequest vehicleRequest) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));

        boolean needsUpdate = false;

        if(Objects.nonNull(vehicleRequest.name()) &&
                !Objects.equals(vehicleRequest.name(), vehicle.getName())) {
            vehicle.setName(vehicleRequest.name());
            needsUpdate = true;
        }

        if(Objects.nonNull(vehicleRequest.type())) {
            VehicleType type = parseVehicleType(vehicleRequest.type());
            if(!Objects.equals(type, vehicle.getType())) {
                vehicle.setType(type);
                needsUpdate = true;
            }
        }

        if(Objects.nonNull(vehicleRequest.capacity()) &&
                !Objects.equals(vehicleRequest.capacity(), vehicle.getCapacity())) {
            vehicle.setCapacity(vehicleRequest.capacity());
            needsUpdate = true;
        }

        if(Objects.nonNull(vehicleRequest.amenities()) &&
                !Objects.equals(vehicleRequest.amenities(), vehicle.getAmenities())) {
            vehicle.setAmenities(vehicleRequest.amenities());
            needsUpdate = true;
        }

        if(Objects.nonNull(vehicleRequest.status())) {
            VehicleStatus status = parseVehicleStatus(vehicleRequest.status());
            if(!Objects.equals(status, vehicle.getStatus())) {
                vehicle.setStatus(status);
                needsUpdate = true;
            }
        }

        if(Objects.nonNull(vehicleRequest.registrationNumber()) &&
                !Objects.equals(vehicleRequest.registrationNumber(), vehicle.getRegistrationNumber())) {
            if(vehicleRepository.existsByRegistrationNumber(vehicleRequest.registrationNumber())) {
                throw new ResourceNotFoundException("Vehicle already exists with registration number: " + vehicleRequest.registrationNumber());
            }
            vehicle.setRegistrationNumber(vehicleRequest.registrationNumber());
            needsUpdate = true;
        }

        if(needsUpdate) {
            vehicleRepository.save(vehicle);
        }

        return vehicleMapper.apply(vehicle);
    }

    @Override
    public void deleteVehicle(String id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));
        vehicleRepository.delete(vehicle);
    }

    private VehicleType parseVehicleType(String type) {
        if (type == null || type.trim().isEmpty()) {
            throw new IllegalArgumentException("Vehicle type cannot be null or empty");
        }
        try {
            return VehicleType.valueOf(type.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid vehicle type: " + type + ". Valid types are: " + java.util.Arrays.toString(VehicleType.values()));
        }
    }

    private VehicleStatus parseVehicleStatus(String status) {
        if (status == null || status.trim().isEmpty()) {
            throw new IllegalArgumentException("Vehicle status cannot be null or empty");
        }
        try {
            return VehicleStatus.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid vehicle status: " + status + ". Valid statuses are: " + java.util.Arrays.toString(VehicleStatus.values()));
        }
    }
}
