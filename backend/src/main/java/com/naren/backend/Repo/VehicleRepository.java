package com.naren.backend.Repo;

import com.naren.backend.Entity.Vehicle;
import com.naren.backend.Entity.VehicleStatus;
import com.naren.backend.Entity.VehicleType;
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
    
    List<Vehicle> findAvailableVehicles(LocalDateTime startTime, LocalDateTime endTime);
    
    List<Vehicle> findByTypeAndCapacityGreaterThan(VehicleType type, int minCapacity);
    
    Long countByType(VehicleType type);
    
    Long countByStatus(VehicleStatus status);
    
    List<Vehicle> findByNameContaining(String name);
    
    @Query("SELECT v FROM Vehicle v WHERE v.status = 'ACTIVE' AND v.id NOT IN " +
           "(SELECT s.vehicle.id FROM Schedule s WHERE s.departureTime BETWEEN :start AND :end)")
    List<Vehicle> findAvailableVehiclesInTimeRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    
    @Query("SELECT COUNT(v) FROM Vehicle v WHERE v.type = :type AND v.status = :status")
    Long countByTypeAndStatus(@Param("type") VehicleType type, @Param("status") VehicleStatus status);
}
