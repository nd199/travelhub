package com.naren.backend.repository;

import com.naren.backend.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    
    Optional<Vehicle> findByVehicleNumber(String vehicleNumber);
    
    Boolean existsByVehicleNumber(String vehicleNumber);
    
    List<Vehicle> findByType(Vehicle.VehicleType type);
    
    List<Vehicle> findByActiveTrue();
    
    List<Vehicle> findByOperator(String operator);
}
