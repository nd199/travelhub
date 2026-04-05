package com.naren.backend.service;

import com.naren.backend.dto.mapper.ScheduleMapper;
import com.naren.backend.entity.Route;
import com.naren.backend.entity.Schedule;
import com.naren.backend.entity.ScheduleStatus;
import com.naren.backend.entity.Vehicle;
import com.naren.backend.exception.InvalidInputException;
import com.naren.backend.exception.ResourceNotFoundException;
import com.naren.backend.exception.ScheduleException;
import com.naren.backend.record.ScheduleRequest;
import com.naren.backend.dto.ScheduleResponse;
import com.naren.backend.repository.RouteRepository;
import com.naren.backend.repository.ScheduleRepository;
import com.naren.backend.repository.VehicleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
public class ScheduleServiceImpl implements ScheduleServiceInterface {

    private static final Logger log = LoggerFactory.getLogger(ScheduleServiceImpl.class);

    private final ScheduleRepository scheduleRepository;
    private final VehicleRepository vehicleRepository;
    private final RouteRepository routeRepository;
    private final ScheduleMapper scheduleMapper;

    public ScheduleServiceImpl(ScheduleRepository scheduleRepository, VehicleRepository vehicleRepository,
                               RouteRepository routeRepository, ScheduleMapper scheduleMapper) {
        this.scheduleRepository = scheduleRepository;
        this.vehicleRepository = vehicleRepository;
        this.routeRepository = routeRepository;
        this.scheduleMapper = scheduleMapper;
    }

    @Override
    public ScheduleResponse createSchedule(ScheduleRequest scheduleRequest) {
        Vehicle vehicle = vehicleRepository.findById(scheduleRequest.vehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found: " + scheduleRequest.vehicleId()));

        Route route = routeRepository.findById(scheduleRequest.routeId())
                .orElseThrow(() -> new ResourceNotFoundException("Route not found: " + scheduleRequest.routeId()));

        if (scheduleRequest.departureTime().isAfter(scheduleRequest.arrivalTime())) {
            throw new ScheduleException("Departure time cannot be after arrival time");
        }

        Schedule schedule = Schedule.builder()
                .vehicle(vehicle)
                .route(route)
                .departureTime(scheduleRequest.departureTime())
                .arrivalTime(scheduleRequest.arrivalTime())
                .actualDepartureTime(scheduleRequest.actualDepartureTime())
                .actualArrivalTime(scheduleRequest.actualArrivalTime())
                .price(scheduleRequest.price())
                .availableSeats(scheduleRequest.availableSeats())
                .status(parseScheduleStatus(scheduleRequest.status()))
                .build();

        Schedule savedSchedule = scheduleRepository.save(schedule);
        log.info("Created schedule {}", savedSchedule.getId());
        return scheduleMapper.apply(savedSchedule);
    }

    @Override
    public ScheduleResponse getScheduleById(String id) {
        return scheduleMapper.apply(scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found")));
    }

    @Override
    public List<ScheduleResponse> getAllSchedules() {
        return scheduleRepository.findAll().stream()
                .map(scheduleMapper)
                .toList();
    }

    @Override
    public List<ScheduleResponse> getSchedulesByVehicleId(String vehicleId) {
        return scheduleRepository.findByVehicleId(vehicleId).stream()
                .map(scheduleMapper)
                .toList();
    }

    @Override
    public List<ScheduleResponse> getSchedulesByRouteId(String routeId) {
        return scheduleRepository.findByRouteId(routeId).stream()
                .map(scheduleMapper)
                .toList();
    }

    @Override
    public List<ScheduleResponse> getSchedulesByStatus(String status) {
        ScheduleStatus scheduleStatus = parseScheduleStatus(status);
        return scheduleRepository.findByStatus(scheduleStatus).stream()
                .map(scheduleMapper)
                .toList();
    }

    @Override
    public List<ScheduleResponse> getSchedulesByDepartureTimeRange(LocalDateTime start, LocalDateTime end) {
        return scheduleRepository.findByDepartureTimeBetween(start, end).stream()
                .map(scheduleMapper)
                .toList();
    }

    @Override
    public List<ScheduleResponse> getActiveSchedulesByRoute(String routeId) {
        return scheduleRepository.findByRouteIdAndStatus(routeId, ScheduleStatus.ACTIVE).stream()
                .map(scheduleMapper)
                .toList();
    }

    @Override
    public ScheduleResponse updateSchedule(String id, ScheduleRequest scheduleRequest) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found: " + id));

        if (Objects.nonNull(scheduleRequest.vehicleId()) &&
                !Objects.equals(scheduleRequest.vehicleId(), schedule.getVehicle().getId())) {
            Vehicle vehicle = vehicleRepository.findById(scheduleRequest.vehicleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found: " + scheduleRequest.vehicleId()));
            schedule.setVehicle(vehicle);
        }

        if (Objects.nonNull(scheduleRequest.routeId()) &&
                !Objects.equals(scheduleRequest.routeId(), schedule.getRoute().getId())) {
            Route route = routeRepository.findById(scheduleRequest.routeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Route not found: " + scheduleRequest.routeId()));
            schedule.setRoute(route);
        }

        if (Objects.nonNull(scheduleRequest.departureTime()) &&
                !Objects.equals(scheduleRequest.departureTime(), schedule.getDepartureTime())) {
            schedule.setDepartureTime(scheduleRequest.departureTime());
        }

        if (Objects.nonNull(scheduleRequest.arrivalTime()) &&
                !Objects.equals(scheduleRequest.arrivalTime(), schedule.getArrivalTime())) {
            schedule.setArrivalTime(scheduleRequest.arrivalTime());
        }

        if (Objects.nonNull(scheduleRequest.actualDepartureTime()) &&
                !Objects.equals(scheduleRequest.actualDepartureTime(), schedule.getActualDepartureTime())) {
            schedule.setActualDepartureTime(scheduleRequest.actualDepartureTime());
        }

        if (Objects.nonNull(scheduleRequest.actualArrivalTime()) &&
                !Objects.equals(scheduleRequest.actualArrivalTime(), schedule.getActualArrivalTime())) {
            schedule.setActualArrivalTime(scheduleRequest.actualArrivalTime());
        }

        if (Objects.nonNull(scheduleRequest.price()) &&
                !Objects.equals(scheduleRequest.price(), schedule.getPrice())) {
            schedule.setPrice(scheduleRequest.price());
        }

        if (Objects.nonNull(scheduleRequest.availableSeats()) &&
                !Objects.equals(scheduleRequest.availableSeats(), schedule.getAvailableSeats())) {
            schedule.setAvailableSeats(scheduleRequest.availableSeats());
        }

        if (Objects.nonNull(scheduleRequest.status())) {
            ScheduleStatus status = parseScheduleStatus(scheduleRequest.status());
            if (!Objects.equals(status, schedule.getStatus())) {
                schedule.setStatus(status);
            }
        }

        scheduleRepository.save(schedule);
        return scheduleMapper.apply(schedule);
    }

    @Override
    public void deleteSchedule(String id) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found: " + id));
        scheduleRepository.delete(schedule);
        log.info("Deleted schedule {}", id);
    }

    @Override
    public List<ScheduleResponse> getSchedulesByDepartureTimeAfter(LocalDateTime time) {
        return scheduleRepository.findByDepartureTimeAfter(time).stream()
                .map(scheduleMapper)
                .toList();
    }

    @Override
    public List<ScheduleResponse> getSchedulesByDepartureTimeBefore(LocalDateTime time) {
        return scheduleRepository.findByDepartureTimeBefore(time).stream()
                .map(scheduleMapper)
                .toList();
    }

    @Override
    public List<ScheduleResponse> getSchedulesByArrivalTimeRange(LocalDateTime start, LocalDateTime end) {
        return scheduleRepository.findByArrivalTimeBetween(start, end).stream()
                .map(scheduleMapper)
                .toList();
    }

    @Override
    public List<ScheduleResponse> getSchedulesByVehicleIdAndDepartureTimeRange(String vehicleId, LocalDateTime start, LocalDateTime end) {
        return scheduleRepository.findByVehicleIdAndDepartureTimeBetween(vehicleId, start, end).stream()
                .map(scheduleMapper)
                .toList();
    }

    @Override
    public List<ScheduleResponse> getSchedulesByPriceRange(double minPrice, double maxPrice) {
        return scheduleRepository.findByPriceBetween(minPrice, maxPrice).stream()
                .map(scheduleMapper)
                .toList();
    }

    @Override
    public List<ScheduleResponse> getSchedulesByAvailableSeatsGreaterThan(int minSeats) {
        return scheduleRepository.findByAvailableSeatsGreaterThan(minSeats).stream()
                .map(scheduleMapper)
                .toList();
    }

    @Override
    public List<ScheduleResponse> getSchedulesByStatusAndDepartureTimeAfter(String status, LocalDateTime time) {
        ScheduleStatus scheduleStatus = parseScheduleStatus(status);
        return scheduleRepository.findByStatusAndDepartureTimeAfter(scheduleStatus, time).stream()
                .map(scheduleMapper)
                .toList();
    }

    @Override
    public List<ScheduleResponse> getAvailableSchedules(LocalDateTime start, LocalDateTime end) {
        return scheduleRepository.findAvailableSchedules(start, end).stream()
                .map(scheduleMapper)
                .toList();
    }

    @Override
    public Long getScheduleCountByVehicleIdAndStatus(String vehicleId, String status) {
        ScheduleStatus scheduleStatus = parseScheduleStatus(status);
        return scheduleRepository.countByVehicleIdAndStatus(vehicleId, scheduleStatus);
    }

    private ScheduleStatus parseScheduleStatus(String status) {
        if (status == null || status.trim().isEmpty()) {
            throw new InvalidInputException("Schedule status cannot be empty");
        }
        try {
            return ScheduleStatus.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new InvalidInputException("Invalid schedule status: " + status);
        }
    }
}
