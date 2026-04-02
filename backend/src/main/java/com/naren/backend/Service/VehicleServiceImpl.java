package com.naren.backend.service;

import com.naren.backend.dto.mapper.VehicleMapper;
import com.naren.backend.entity.Vehicle;
import com.naren.backend.entity.VehicleStatus;
import com.naren.backend.entity.VehicleType;
import com.naren.backend.exception.DuplicateResourceException;
import com.naren.backend.exception.InvalidInputException;
import com.naren.backend.exception.ResourceNotFoundException;
import com.naren.backend.record.VehicleRequest;
import com.naren.backend.dto.VehicleResponse;
import com.naren.backend.repository.VehicleRepository;
import com.naren.backend.service.VehicleServiceInterface;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
public class VehicleServiceImpl implements VehicleServiceInterface {

    private static final Logger logger = LoggerFactory.getLogger(VehicleServiceImpl.class);

    private final VehicleRepository vehicleRepository;
    private final VehicleMapper vehicleMapper;

    public VehicleServiceImpl(VehicleRepository vehicleRepository, VehicleMapper vehicleMapper) {
        this.vehicleRepository = vehicleRepository;
        this.vehicleMapper = vehicleMapper;
    }

    @Override
    public VehicleResponse createVehicle(VehicleRequest vehicleRequest) {
        if(vehicleRepository.existsByRegistrationNumber(vehicleRequest.registrationNumber())) {
            throw new DuplicateResourceException("Vehicle already exists with registration: " + vehicleRequest.registrationNumber());
        }

        Vehicle vehicle = Vehicle.builder()
                .name(vehicleRequest.name())
                .type(parseVehicleType(vehicleRequest.type()))
                .capacity(vehicleRequest.capacity())
                .amenities(vehicleRequest.amenities())
                .status(parseVehicleStatus(vehicleRequest.status()))
                .registrationNumber(vehicleRequest.registrationNumber())
                .build();

        return vehicleMapper.apply(vehicleRepository.save(vehicle));
    }

    @Override
    public VehicleResponse getVehicleById(String id) {
        return vehicleMapper.apply(vehicleRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Vehicle not found")
        ));
    }

    @Override
    public VehicleResponse getVehicleByRegistrationNumber(String registrationNumber) {
        return vehicleMapper.apply(vehicleRepository.findByRegistrationNumber(registrationNumber)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Vehicle not found")
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
        logger.info("Fetching vehicles by type: {}", type);
        VehicleType vehicleType = parseVehicleType(type);
        return vehicleRepository.findByType(vehicleType).stream()
                .map(vehicleMapper)
                .toList();
    }

    @Override
    public List<VehicleResponse> getVehiclesByStatus(String status) {
        logger.info("Fetching vehicles by status: {}", status);
        VehicleStatus vehicleStatus = parseVehicleStatus(status);
        return vehicleRepository.findByStatus(vehicleStatus).stream()
                .map(vehicleMapper)
                .toList();
    }

    @Override
    public VehicleResponse updateVehicle(String id, VehicleRequest vehicleRequest) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found: " + id));

        if(vehicleRequest.name() != null) {
            vehicle.setName(vehicleRequest.name());
        }

        if(vehicleRequest.type() != null) {
            vehicle.setType(parseVehicleType(vehicleRequest.type()));
        }

        if(vehicleRequest.capacity() != null) {
            vehicle.setCapacity(vehicleRequest.capacity());
        }

        if(vehicleRequest.amenities() != null) {
            vehicle.setAmenities(vehicleRequest.amenities());
        }

        if(vehicleRequest.status() != null) {
            vehicle.setStatus(parseVehicleStatus(vehicleRequest.status()));
        }

        if(vehicleRequest.registrationNumber() != null &&
           !vehicleRequest.registrationNumber().equals(vehicle.getRegistrationNumber())) {
            if(vehicleRepository.existsByRegistrationNumber(vehicleRequest.registrationNumber())) {
                throw new DuplicateResourceException("Vehicle already exists with registration: " + vehicleRequest.registrationNumber());
            }
            vehicle.setRegistrationNumber(vehicleRequest.registrationNumber());
        }

        return vehicleMapper.apply(vehicleRepository.save(vehicle));
    }

    @Override
    public void deleteVehicle(String id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found: " + id));
        vehicleRepository.delete(vehicle);
    }

    @Override
    public List<VehicleResponse> getVehiclesByTypeAndStatus(String type, String status) {
        logger.info("Fetching vehicles by type: {} and status: {}", type, status);
        VehicleType vehicleType = parseVehicleType(type);
        VehicleStatus vehicleStatus = parseVehicleStatus(status);
        return vehicleRepository.findByTypeAndStatus(vehicleType, vehicleStatus).stream()
                .map(vehicleMapper)
                .toList();
    }

    @Override
    public List<VehicleResponse> getVehiclesByCapacityRange(int minCapacity, int maxCapacity) {
        logger.info("Fetching vehicles by capacity range: {} to {}", minCapacity, maxCapacity);
        return vehicleRepository.findByCapacityBetween(minCapacity, maxCapacity).stream()
                .map(vehicleMapper)
                .toList();
    }

    @Override
    public List<VehicleResponse> getVehiclesByAmenitiesContaining(String amenity) {
        logger.info("Fetching vehicles by amenities containing: {}", amenity);
        return vehicleRepository.findByAmenitiesContaining(amenity).stream()
                .map(vehicleMapper)
                .toList();
    }

    @Override
    public List<VehicleResponse> getAvailableVehicles(LocalDateTime startTime, LocalDateTime endTime) {
        logger.info("Fetching available vehicles from {} to {}", startTime, endTime);
        return vehicleRepository.findAvailableVehicles(startTime, endTime).stream()
                .map(vehicleMapper)
                .toList();
    }

    @Override
    public List<VehicleResponse> getVehiclesByTypeAndCapacityGreaterThan(String type, int minCapacity) {
        logger.info("Fetching vehicles by type: {} with capacity greater than {}", type, minCapacity);
        VehicleType vehicleType = parseVehicleType(type);
        return vehicleRepository.findByTypeAndCapacityGreaterThan(vehicleType, minCapacity).stream()
                .map(vehicleMapper)
                .toList();
    }

    @Override
    public Long getVehicleCountByType(String type) {
        logger.info("Getting vehicle count by type: {}", type);
        VehicleType vehicleType = parseVehicleType(type);
        return vehicleRepository.countByType(vehicleType);
    }

    @Override
    public Long getVehicleCountByStatus(String status) {
        logger.info("Getting vehicle count by status: {}", status);
        VehicleStatus vehicleStatus = parseVehicleStatus(status);
        return vehicleRepository.countByStatus(vehicleStatus);
    }

    @Override
    public List<VehicleResponse> getVehiclesByNameContaining(String name) {
        logger.info("Fetching vehicles by name containing: {}", name);
        return vehicleRepository.findByNameContaining(name).stream()
                .map(vehicleMapper)
                .toList();
    }

    @Override
    public List<VehicleResponse> getAvailableVehiclesInTimeRange(LocalDateTime start, LocalDateTime end) {
        logger.info("Fetching available vehicles in time range: {} to {}", start, end);
        return vehicleRepository.findAvailableVehiclesInTimeRange(start, end).stream()
                .map(vehicleMapper)
                .toList();
    }

    @Override
    public Long getVehicleCountByTypeAndStatus(String type, String status) {
        logger.info("Getting vehicle count by type: {} and status: {}", type, status);
        VehicleType vehicleType = parseVehicleType(type);
        VehicleStatus vehicleStatus = parseVehicleStatus(status);
        return vehicleRepository.countByTypeAndStatus(vehicleType, vehicleStatus);
    }

    private VehicleType parseVehicleType(String type) {
        if (type == null || type.trim().isEmpty()) {
            throw new InvalidInputException("Vehicle type cannot be empty");
        }
        try {
            return VehicleType.valueOf(type.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new InvalidInputException("Invalid vehicle type: " + type);
        }
    }

    private VehicleStatus parseVehicleStatus(String status) {
        if (status == null || status.trim().isEmpty()) {
            throw new InvalidInputException("Vehicle status cannot be empty");
        }
        try {
            return VehicleStatus.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new InvalidInputException("Invalid vehicle status: " + status);
        }
    }
}
