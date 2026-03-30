package com.naren.backend.Repo;

import com.naren.backend.Entity.Vehicle;
import com.naren.backend.Entity.VehicleStatus;
import com.naren.backend.Entity.VehicleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, String> {
    Optional<Vehicle> findByRegistrationNumber(String registrationNumber);
    List<Vehicle> findByType(VehicleType type);
    List<Vehicle> findByStatus(VehicleStatus status);
    boolean existsByRegistrationNumber(String registrationNumber);
}
