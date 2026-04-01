@package com.naren.backend.service;

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
        logger.info("Creating vehicle with registration number: {}", vehicleRequest.registrationNumber());
        if(vehicleRepository.existsByRegistrationNumber(vehicleRequest.registrationNumber())) {
            logger.error("Vehicle already exists with registration number: {}", vehicleRequest.registrationNumber());
            throw new DuplicateResourceException("Vehicle already exists with registration number: " + vehicleRequest.registrationNumber());
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
        logger.info("Vehicle created successfully with id: {}", savedVehicle.getId());
        return vehicleMapper.apply(savedVehicle);
    }

    @Override
    public VehicleResponse getVehicleById(String id) {
        logger.info("Fetching vehicle by id: {}", id);
        return vehicleMapper.apply(vehicleRepository.findById(id).orElseThrow(
                () -> {
                    logger.error("Vehicle not found with id: {}", id);
                    return new ResourceNotFoundException("Vehicle Not Found");
                }
        ));
    }

    @Override
    public VehicleResponse getVehicleByRegistrationNumber(String registrationNumber) {
        logger.info("Fetching vehicle by registration number: {}", registrationNumber);
        return vehicleMapper.apply(vehicleRepository.findByRegistrationNumber(registrationNumber)
                .orElseThrow(
                        () -> {
                            logger.error("Vehicle not found with registration number: {}", registrationNumber);
                            return new ResourceNotFoundException("Vehicle Not Found");
                        }
                ));
    }

    @Override
    public List<VehicleResponse> getAllVehicles() {
        logger.info("Fetching all vehicles");
        List<VehicleResponse> vehicles = vehicleRepository.findAll().stream()
                .map(vehicleMapper)
                .toList();
        logger.info("Retrieved {} vehicles", vehicles.size());
        return vehicles;
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
        logger.info("Updating vehicle with id: {}", id);
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Vehicle not found with id: {}", id);
                    return new ResourceNotFoundException("Vehicle not found with id: " + id);
                });

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
            logger.error("Vehicle already exists with registration number: {}", vehicleRequest.registrationNumber());
            throw new DuplicateResourceException("Vehicle already exists with registration number: " + vehicleRequest.registrationNumber());
        }
            vehicle.setRegistrationNumber(vehicleRequest.registrationNumber());
            needsUpdate = true;
        }

        if(needsUpdate) {
            vehicleRepository.save(vehicle);
            logger.info("Vehicle updated successfully with id: {}", id);
        } else {
            logger.info("No changes detected for vehicle id: {}", id);
        }

        return vehicleMapper.apply(vehicle);
    }

    @Override
    public void deleteVehicle(String id) {
        logger.info("Deleting vehicle with id: {}", id);
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Vehicle not found with id: {}", id);
                    return new ResourceNotFoundException("Vehicle not found with id: " + id);
                });
        vehicleRepository.delete(vehicle);
        logger.info("Vehicle deleted successfully with id: {}", id);
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
        logger.debug("Parsing vehicle type: {}", type);
        if (type == null || type.trim().isEmpty()) {
            logger.error("Vehicle type cannot be null or empty");
            throw new InvalidInputException("Vehicle type cannot be null or empty");
        }
        try {
            VehicleType result = VehicleType.valueOf(type.trim().toUpperCase());
            logger.debug("Parsed vehicle type: {}", result);
            return result;
        } catch (IllegalArgumentException e) {
            logger.error("Invalid vehicle type: {}", type);
            throw new InvalidInputException("Invalid vehicle type: " + type + ". Valid types are: " + java.util.Arrays.toString(VehicleType.values()));
        }
    }

    private VehicleStatus parseVehicleStatus(String status) {
        logger.debug("Parsing vehicle status: {}", status);
        if (status == null || status.trim().isEmpty()) {
            logger.error("Vehicle status cannot be null or empty");
            throw new InvalidInputException("Vehicle status cannot be null or empty");
        }
        try {
            VehicleStatus result = VehicleStatus.valueOf(status.trim().toUpperCase());
            logger.debug("Parsed vehicle status: {}", result);
            return result;
        } catch (IllegalArgumentException e) {
            logger.error("Invalid vehicle status: {}", status);
            throw new InvalidInputException("Invalid vehicle status: " + status + ". Valid statuses are: " + java.util.Arrays.toString(VehicleStatus.values()));
        }
    }
}
