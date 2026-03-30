package com.naren.backend.Repo;

import com.naren.backend.Entity.Seat;
import com.naren.backend.Entity.SeatStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatRepository extends JpaRepository<Seat, String> {
    List<Seat> findByVehicleId(String vehicleId);
    List<Seat> findByStatus(SeatStatus status);
    List<Seat> findByVehicleIdAndStatus(String vehicleId, SeatStatus status);
}
