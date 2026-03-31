package com.naren.backend.Service;

import com.naren.backend.Record.ScheduleResponse;
import com.naren.backend.DTO.mapper.ScheduleMapper;
import com.naren.backend.Entity.Route;
import com.naren.backend.Entity.Schedule;
import com.naren.backend.Entity.ScheduleStatus;
import com.naren.backend.Entity.Vehicle;
import com.naren.backend.Exception.ResourceNotFoundException;
import com.naren.backend.Record.ScheduleRequest;
import com.naren.backend.Repo.RouteRepository;
import com.naren.backend.Repo.ScheduleRepository;
import com.naren.backend.Repo.VehicleRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final VehicleRepository vehicleRepository;
    private final RouteRepository routeRepository;
    private final ScheduleMapper scheduleMapper;

    public ScheduleService(ScheduleRepository scheduleRepository, VehicleRepository vehicleRepository,
                         RouteRepository routeRepository, ScheduleMapper scheduleMapper) {
        this.scheduleRepository = scheduleRepository;
        this.vehicleRepository = vehicleRepository;
        this.routeRepository = routeRepository;
        this.scheduleMapper = scheduleMapper;
    }

    public ScheduleResponse createSchedule(ScheduleRequest scheduleRequest) {
        Vehicle vehicle = vehicleRepository.findById(scheduleRequest.vehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + scheduleRequest.vehicleId()));

        Route route = routeRepository.findById(scheduleRequest.routeId())
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with id: " + scheduleRequest.routeId()));

        if(scheduleRequest.departureTime().isAfter(scheduleRequest.arrivalTime())) {
            throw new RuntimeException("Departure time cannot be after arrival time");
        }

        Schedule schedule = Schedule
                .builder()
                .vehicle(vehicle)
                .route(route)
                .departureTime(scheduleRequest.departureTime())
                .arrivalTime(scheduleRequest.arrivalTime())
                .actualDepartureTime(scheduleRequest.actualDepartureTime())
                .actualArrivalTime(scheduleRequest.actualArrivalTime())
                .price(scheduleRequest.price())
                .availableSeats(scheduleRequest.availableSeats())
                .status(ScheduleStatus.valueOf(scheduleRequest.status().toUpperCase()))
                .build();

        Schedule savedSchedule = scheduleRepository.save(schedule);
        return scheduleMapper.apply(savedSchedule);
    }

    public ScheduleResponse getScheduleById(String id) {
        return scheduleMapper.apply(scheduleRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Schedule Not Found")
        ));
    }

    public List<ScheduleResponse> getAllSchedules() {
        return scheduleRepository.findAll().stream()
                .map(scheduleMapper)
                .toList();
    }

    public List<ScheduleResponse> getSchedulesByVehicleId(String vehicleId) {
        return scheduleRepository.findByVehicleId(vehicleId).stream()
                .map(scheduleMapper)
                .toList();
    }

    public List<ScheduleResponse> getSchedulesByRouteId(String routeId) {
        return scheduleRepository.findByRouteId(routeId).stream()
                .map(scheduleMapper)
                .toList();
    }

    public List<ScheduleResponse> getSchedulesByStatus(String status) {
        ScheduleStatus scheduleStatus = ScheduleStatus.valueOf(status.toUpperCase());
        return scheduleRepository.findByStatus(scheduleStatus).stream()
                .map(scheduleMapper)
                .toList();
    }

    public List<ScheduleResponse> getSchedulesByDepartureTimeRange(LocalDateTime start, LocalDateTime end) {
        return scheduleRepository.findByDepartureTimeBetween(start, end).stream()
                .map(scheduleMapper)
                .toList();
    }

    public List<ScheduleResponse> getActiveSchedulesByRoute(String routeId) {
        return scheduleRepository.findByRouteIdAndStatus(routeId, ScheduleStatus.ACTIVE).stream()
                .map(scheduleMapper)
                .toList();
    }

    public ScheduleResponse updateSchedule(String id, ScheduleRequest scheduleRequest) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with id: " + id));

        boolean needsUpdate = false;

        if(Objects.nonNull(scheduleRequest.vehicleId()) &&
                !Objects.equals(scheduleRequest.vehicleId(), schedule.getVehicle().getId())) {
            Vehicle vehicle = vehicleRepository.findById(scheduleRequest.vehicleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + scheduleRequest.vehicleId()));
            schedule.setVehicle(vehicle);
            needsUpdate = true;
        }

        if(Objects.nonNull(scheduleRequest.routeId()) &&
                !Objects.equals(scheduleRequest.routeId(), schedule.getRoute().getId())) {
            Route route = routeRepository.findById(scheduleRequest.routeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Route not found with id: " + scheduleRequest.routeId()));
            schedule.setRoute(route);
            needsUpdate = true;
        }

        if(Objects.nonNull(scheduleRequest.departureTime()) &&
                !Objects.equals(scheduleRequest.departureTime(), schedule.getDepartureTime())) {
            schedule.setDepartureTime(scheduleRequest.departureTime());
            needsUpdate = true;
        }

        if(Objects.nonNull(scheduleRequest.arrivalTime()) &&
                !Objects.equals(scheduleRequest.arrivalTime(), schedule.getArrivalTime())) {
            schedule.setArrivalTime(scheduleRequest.arrivalTime());
            needsUpdate = true;
        }

        if(Objects.nonNull(scheduleRequest.actualDepartureTime()) &&
                !Objects.equals(scheduleRequest.actualDepartureTime(), schedule.getActualDepartureTime())) {
            schedule.setActualDepartureTime(scheduleRequest.actualDepartureTime());
            needsUpdate = true;
        }

        if(Objects.nonNull(scheduleRequest.actualArrivalTime()) &&
                !Objects.equals(scheduleRequest.actualArrivalTime(), schedule.getActualArrivalTime())) {
            schedule.setActualArrivalTime(scheduleRequest.actualArrivalTime());
            needsUpdate = true;
        }

        if(Objects.nonNull(scheduleRequest.price()) &&
                !Objects.equals(scheduleRequest.price(), schedule.getPrice())) {
            schedule.setPrice(scheduleRequest.price());
            needsUpdate = true;
        }

        if(Objects.nonNull(scheduleRequest.availableSeats()) &&
                !Objects.equals(scheduleRequest.availableSeats(), schedule.getAvailableSeats())) {
            schedule.setAvailableSeats(scheduleRequest.availableSeats());
            needsUpdate = true;
        }

        if(Objects.nonNull(scheduleRequest.status())) {
            ScheduleStatus status = ScheduleStatus.valueOf(scheduleRequest.status().toUpperCase());
            if(!Objects.equals(status, schedule.getStatus())) {
                schedule.setStatus(status);
                needsUpdate = true;
            }
        }

        if(needsUpdate) {
            scheduleRepository.save(schedule);
        }

        return scheduleMapper.apply(schedule);
    }

    public void deleteSchedule(String id) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with id: " + id));
        scheduleRepository.delete(schedule);
    }
}
