package com.naren.backend.Repo;

import com.naren.backend.Entity.Schedule;
import com.naren.backend.Entity.ScheduleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, String> {
    List<Schedule> findByVehicleId(String vehicleId);

    List<Schedule> findByRouteId(String routeId);

    List<Schedule> findByStatus(ScheduleStatus status);

    List<Schedule> findByDepartureTimeBetween(LocalDateTime start, LocalDateTime end);

    List<Schedule> findByRouteIdAndStatus(String routeId, ScheduleStatus status);
}
