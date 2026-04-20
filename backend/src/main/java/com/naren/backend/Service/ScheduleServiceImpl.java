package com.naren.backend.service;

import com.naren.backend.dto.ScheduleRequest;
import com.naren.backend.dto.ScheduleResponse;
import com.naren.backend.entity.Schedule;
import com.naren.backend.repository.ScheduleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ScheduleServiceImpl implements ScheduleService {

    private final ScheduleRepository scheduleRepository;

    public ScheduleServiceImpl(ScheduleRepository scheduleRepository) {
        this.scheduleRepository = scheduleRepository;
    }

    @Override
    public ScheduleResponse createSchedule(ScheduleRequest request) {
        return null; // Simplified implementation
    }

    @Override
    public ScheduleResponse getScheduleById(String id) {
        return scheduleRepository.findById(id)
                .map(this::mapToScheduleResponse)
                .orElse(null);
    }

    @Override
    public List<ScheduleResponse> getAllSchedules() {
        return scheduleRepository.findAll().stream()
                .map(this::mapToScheduleResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ScheduleResponse> getSchedulesByVehicleId(String vehicleId) {
        return List.of(); // Simplified implementation
    }

    @Override
    public List<ScheduleResponse> getSchedulesByRouteId(String routeId) {
        return List.of(); // Simplified implementation
    }

    @Override
    public List<ScheduleResponse> getSchedulesByStatus(String status) {
        return List.of(); // Simplified implementation
    }

    @Override
    public ScheduleResponse updateSchedule(String id, ScheduleRequest request) {
        return null; // Simplified implementation
    }

    @Override
    public void deleteSchedule(String id) {
        scheduleRepository.deleteById(id);
    }

    private ScheduleResponse mapToScheduleResponse(Schedule schedule) {
        return new ScheduleResponse(
                schedule.getId(),
                schedule.getVehicle() != null ? schedule.getVehicle().getId() : null,
                schedule.getRoute() != null ? schedule.getRoute().getId() : null,
                schedule.getDepartureTime(),
                schedule.getArrivalTime(),
                null, // actualDepartureTime
                null, // actualArrivalTime
                schedule.getPrice(),
                schedule.getAvailableSeats(),
                schedule.getStatus().toString(),
                schedule.getCreatedAt(),
                schedule.getUpdatedAt()
        );
    }
}
