package com.naren.backend.repository;

import com.naren.backend.entity.Vehicle;
import com.naren.backend.entity.VehicleStatus;
import com.naren.backend.entity.VehicleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, String> {
    Optional<Vehicle> findByRegistrationNumber(String registrationNumber);
    
    List<Vehicle> findByType(VehicleType type);
    
    List<Vehicle> findByStatus(VehicleStatus status);
    
    boolean existsByRegistrationNumber(String registrationNumber);
    
    List<Vehicle> findByTypeAndStatus(VehicleType type, VehicleStatus status);
    
    List<Vehicle> findByCapacityBetween(int minCapacity, int maxCapacity);
    
    List<Vehicle> findByAmenitiesContaining(String amenity);
    
    @Query(value = "SELECT v FROM Vehicle v WHERE v.status = 'ACTIVE' AND v.id NOT IN " +
           "(SELECT s.vehicle_id FROM Schedule s WHERE s.departure_time BETWEEN :startTime AND :endTime)", nativeQuery = true)
    List<Vehicle> findAvailableVehicles(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);
    
    List<Vehicle> findByTypeAndCapacityGreaterThan(VehicleType type, int minCapacity);
    
    Long countByType(VehicleType type);
    
    Long countByStatus(VehicleStatus status);
    
    List<Vehicle> findByNameContaining(String name);
    
    @Query(value = "SELECT v FROM Vehicle v WHERE v.status = 'ACTIVE' AND v.id NOT IN " +
           "(SELECT s.vehicle_id FROM Schedule s WHERE s.departure_time BETWEEN :start AND :end)", nativeQuery = true)
    List<Vehicle> findAvailableVehiclesInTimeRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    
    @Query(value = "SELECT COUNT(v) FROM Vehicle v WHERE v.type = :type AND v.status = :status", nativeQuery = true)
    Long countByTypeAndStatus(@Param("type") VehicleType type, @Param("status") VehicleStatus status);
}
