package com.naren.backend.Service;

import com.naren.backend.Record.VehicleResponse;
import com.naren.backend.DTO.mapper.VehicleMapper;
import com.naren.backend.Entity.Vehicle;
import com.naren.backend.Entity.VehicleStatus;
import com.naren.backend.Entity.VehicleType;
import com.naren.backend.Exception.ResourceNotFoundException;
import com.naren.backend.Record.VehicleRequest;
import com.naren.backend.Repo.VehicleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final VehicleMapper vehicleMapper;

    public VehicleService(VehicleRepository vehicleRepository, VehicleMapper vehicleMapper) {
        this.vehicleRepository = vehicleRepository;
        this.vehicleMapper = vehicleMapper;
    }

    public VehicleResponse createVehicle(VehicleRequest vehicleRequest) {
        if(vehicleRepository.existsByRegistrationNumber(vehicleRequest.registrationNumber())) {
            throw new RuntimeException("Vehicle already exists with registration number: " + vehicleRequest.registrationNumber());
        }

        Vehicle vehicle = Vehicle
                .builder()
                .name(vehicleRequest.name())
                .type(VehicleType.valueOf(vehicleRequest.type().toUpperCase()))
                .capacity(vehicleRequest.capacity())
                .amenities(vehicleRequest.amenities())
                .status(VehicleStatus.valueOf(vehicleRequest.status().toUpperCase()))
                .registrationNumber(vehicleRequest.registrationNumber())
                .build();

        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return vehicleMapper.apply(savedVehicle);
    }

    public VehicleResponse getVehicleById(String id) {
        return vehicleMapper.apply(vehicleRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Vehicle Not Found")
        ));
    }

    public VehicleResponse getVehicleByRegistrationNumber(String registrationNumber) {
        return vehicleMapper.apply(vehicleRepository.findByRegistrationNumber(registrationNumber)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Vehicle Not Found")
                ));
    }

    public List<VehicleResponse> getAllVehicles() {
        return vehicleRepository.findAll().stream()
                .map(vehicleMapper)
                .toList();
    }

    public List<VehicleResponse> getVehiclesByType(String type) {
        VehicleType vehicleType = VehicleType.valueOf(type.toUpperCase());
        return vehicleRepository.findByType(vehicleType).stream()
                .map(vehicleMapper)
                .toList();
    }

    public List<VehicleResponse> getVehiclesByStatus(String status) {
        VehicleStatus vehicleStatus = VehicleStatus.valueOf(status.toUpperCase());
        return vehicleRepository.findByStatus(vehicleStatus).stream()
                .map(vehicleMapper)
                .toList();
    }

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
            VehicleType type = VehicleType.valueOf(vehicleRequest.type().toUpperCase());
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
            VehicleStatus status = VehicleStatus.valueOf(vehicleRequest.status().toUpperCase());
            if(!Objects.equals(status, vehicle.getStatus())) {
                vehicle.setStatus(status);
                needsUpdate = true;
            }
        }

        if(Objects.nonNull(vehicleRequest.registrationNumber()) &&
                !Objects.equals(vehicleRequest.registrationNumber(), vehicle.getRegistrationNumber())) {
            if(vehicleRepository.existsByRegistrationNumber(vehicleRequest.registrationNumber())) {
                throw new RuntimeException("Vehicle already exists with registration number: " + vehicleRequest.registrationNumber());
            }
            vehicle.setRegistrationNumber(vehicleRequest.registrationNumber());
            needsUpdate = true;
        }

        if(needsUpdate) {
            vehicleRepository.save(vehicle);
        }

        return vehicleMapper.apply(vehicle);
    }

    public void deleteVehicle(String id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));
        vehicleRepository.delete(vehicle);
    }
}
