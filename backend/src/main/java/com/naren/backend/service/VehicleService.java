package com.naren.backend.service;

import com.naren.backend.entity.Vehicle;
import com.naren.backend.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public Vehicle createVehicle(Vehicle vehicle) {
        if (vehicleRepository.existsByVehicleNumber(vehicle.getVehicleNumber())) {
            throw new RuntimeException("Vehicle number already exists");
        }
        vehicle.setAvailableSeats(vehicle.getTotalSeats());
        return vehicleRepository.save(vehicle);
    }

    public Vehicle updateVehicle(Long id, Vehicle vehicleDetails) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + id));

        vehicle.setName(vehicleDetails.getName());
        vehicle.setType(vehicleDetails.getType());
        vehicle.setTotalSeats(vehicleDetails.getTotalSeats());
        vehicle.setAvailableSeats(vehicleDetails.getAvailableSeats());
        vehicle.setActive(vehicleDetails.getActive());
        vehicle.setDescription(vehicleDetails.getDescription());
        vehicle.setOperator(vehicleDetails.getOperator());

        return vehicleRepository.save(vehicle);
    }

    public void deleteVehicle(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + id));
        vehicleRepository.delete(vehicle);
    }

    @Transactional(readOnly = true)
    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public Vehicle getVehicleByVehicleNumber(String vehicleNumber) {
        return vehicleRepository.findByVehicleNumber(vehicleNumber)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with vehicle number: " + vehicleNumber));
    }

    @Transactional(readOnly = true)
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Vehicle> getActiveVehicles() {
        return vehicleRepository.findByActiveTrue();
    }

    @Transactional(readOnly = true)
    public List<Vehicle> getVehiclesByType(Vehicle.VehicleType type) {
        return vehicleRepository.findByType(type);
    }

    @Transactional(readOnly = true)
    public List<Vehicle> getVehiclesByOperator(String operator) {
        return vehicleRepository.findByOperator(operator);
    }

    public Vehicle updateAvailableSeats(Long id, Integer seatsToBook) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + id));

        int newAvailableSeats = vehicle.getAvailableSeats() - seatsToBook;
        if (newAvailableSeats < 0) {
            throw new RuntimeException("Not enough seats available");
        }

        vehicle.setAvailableSeats(newAvailableSeats);
        return vehicleRepository.save(vehicle);
    }

    public Vehicle releaseSeats(Long id, Integer seatsToRelease) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + id));

        int newAvailableSeats = vehicle.getAvailableSeats() + seatsToRelease;
        if (newAvailableSeats > vehicle.getTotalSeats()) {
            throw new RuntimeException("Cannot release more seats than total seats");
        }

        vehicle.setAvailableSeats(newAvailableSeats);
        return vehicleRepository.save(vehicle);
    }
}
