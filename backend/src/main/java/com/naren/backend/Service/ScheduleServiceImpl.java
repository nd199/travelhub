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
import com.naren.backend.service.ScheduleServiceInterface;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
public class ScheduleServiceImpl implements ScheduleServiceInterface {

    private static final Logger logger = LoggerFactory.getLogger(ScheduleServiceImpl.class);

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
        logger.info("Creating schedule for vehicle id: {} and route id: {}", scheduleRequest.vehicleId(), scheduleRequest.routeId());
        Vehicle vehicle = vehicleRepository.findById(scheduleRequest.vehicleId())
                .orElseThrow(() -> {
                    logger.error("Vehicle not found with id: {}", scheduleRequest.vehicleId());
                    return new ResourceNotFoundException("Vehicle not found with id: " + scheduleRequest.vehicleId());
                });

        Route route = routeRepository.findById(scheduleRequest.routeId())
                .orElseThrow(() -> {
                    logger.error("Route not found with id: {}", scheduleRequest.routeId());
                    return new ResourceNotFoundException("Route not found with id: " + scheduleRequest.routeId());
                });

        if(scheduleRequest.departureTime().isAfter(scheduleRequest.arrivalTime())) {
            logger.error("Departure time cannot be after arrival time");
            throw new ScheduleException("Departure time cannot be after arrival time");
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
                .status(parseScheduleStatus(scheduleRequest.status()))
                .build();

        Schedule savedSchedule = scheduleRepository.save(schedule);
        logger.info("Schedule created successfully with id: {}", savedSchedule.getId());
        return scheduleMapper.apply(savedSchedule);
    }

    @Override
    public ScheduleResponse getScheduleById(String id) {
        logger.info("Fetching schedule by id: {}", id);
        return scheduleMapper.apply(scheduleRepository.findById(id).orElseThrow(
                () -> {
                    logger.error("Schedule not found with id: {}", id);
                    return new ResourceNotFoundException("Schedule Not Found");
                }
        ));
    }

    @Override
    public List<ScheduleResponse> getAllSchedules() {
        logger.info("Fetching all schedules");
        return scheduleRepository.findAll().stream()
                .map(scheduleMapper)
                .toList();
    }

    @Override
    public List<ScheduleResponse> getSchedulesByVehicleId(String vehicleId) {
        logger.info("Fetching schedules by vehicle id: {}", vehicleId);
        return scheduleRepository.findByVehicleId(vehicleId).stream()
                .map(scheduleMapper)
                .toList();
    }

    @Override
    public List<ScheduleResponse> getSchedulesByRouteId(String routeId) {
        logger.info("Fetching schedules by route id: {}", routeId);
        return scheduleRepository.findByRouteId(routeId).stream()
                .map(scheduleMapper)
                .toList();
    }

    @Override
    public List<ScheduleResponse> getSchedulesByStatus(String status) {
        logger.info("Fetching schedules by status: {}", status);
        ScheduleStatus scheduleStatus = parseScheduleStatus(status);
        return scheduleRepository.findByStatus(scheduleStatus).stream()
                .map(scheduleMapper)
                .toList();
    }

    @Override
    public List<ScheduleResponse> getSchedulesByDepartureTimeRange(LocalDateTime start, LocalDateTime end) {
        logger.info("Fetching schedules by departure time range: {} to {}", start, end);
        return scheduleRepository.findByDepartureTimeBetween(start, end).stream()
                .map(scheduleMapper)
                .toList();
    }

    @Override
    public List<ScheduleResponse> getActiveSchedulesByRoute(String routeId) {
        logger.info("Fetching active schedules by route id: {}", routeId);
        return scheduleRepository.findByRouteIdAndStatus(routeId, ScheduleStatus.ACTIVE).stream()
                .map(scheduleMapper)
                .toList();
    }

    @Override
    public ScheduleResponse updateSchedule(String id, ScheduleRequest scheduleRequest) {
        logger.info("Updating schedule with id: {}", id);
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Schedule not found with id: {}", id);
                    return new ResourceNotFoundException("Schedule not found with id: " + id);
                });

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
            ScheduleStatus status = parseScheduleStatus(scheduleRequest.status());
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

    @Override
    public void deleteSchedule(String id) {
        logger.info("Deleting schedule with id: {}", id);
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Schedule not found with id: {}", id);
                    return new ResourceNotFoundException("Schedule not found with id: " + id);
                });
        scheduleRepository.delete(schedule);
        logger.info("Schedule deleted successfully with id: {}", id);
    }

    @Override
    public List<ScheduleResponse> getSchedulesByDepartureTimeAfter(LocalDateTime time) {
        logger.info("Fetching schedules by departure time after: {}", time);
        return scheduleRepository.findByDepartureTimeAfter(time).stream()
                .map(scheduleMapper)
                .toList();
    }

    @Override
    public List<ScheduleResponse> getSchedulesByDepartureTimeBefore(LocalDateTime time) {
        logger.info("Fetching schedules by departure time before: {}", time);
        return scheduleRepository.findByDepartureTimeBefore(time).stream()
                .map(scheduleMapper)
                .toList();
    }

    @Override
    public List<ScheduleResponse> getSchedulesByArrivalTimeRange(LocalDateTime start, LocalDateTime end) {
        logger.info("Fetching schedules by arrival time range: {} to {}", start, end);
        return scheduleRepository.findByArrivalTimeBetween(start, end).stream()
                .map(scheduleMapper)
                .toList();
    }

    @Override
    public List<ScheduleResponse> getSchedulesByVehicleIdAndDepartureTimeRange(String vehicleId, LocalDateTime start, LocalDateTime end) {
        logger.info("Fetching schedules by vehicle id: {} and departure time range: {} to {}", vehicleId, start, end);
        return scheduleRepository.findByVehicleIdAndDepartureTimeBetween(vehicleId, start, end).stream()
                .map(scheduleMapper)
                .toList();
    }

    @Override
    public List<ScheduleResponse> getSchedulesByPriceRange(double minPrice, double maxPrice) {
        logger.info("Fetching schedules by price range: {} to {}", minPrice, maxPrice);
        return scheduleRepository.findByPriceBetween(minPrice, maxPrice).stream()
                .map(scheduleMapper)
                .toList();
    }

    @Override
    public List<ScheduleResponse> getSchedulesByAvailableSeatsGreaterThan(int minSeats) {
        logger.info("Fetching schedules by available seats greater than: {}", minSeats);
        return scheduleRepository.findByAvailableSeatsGreaterThan(minSeats).stream()
                .map(scheduleMapper)
                .toList();
    }

    @Override
    public List<ScheduleResponse> getSchedulesByStatusAndDepartureTimeAfter(String status, LocalDateTime time) {
        logger.info("Fetching schedules by status: {} and departure time after: {}", status, time);
        ScheduleStatus scheduleStatus = parseScheduleStatus(status);
        return scheduleRepository.findByStatusAndDepartureTimeAfter(scheduleStatus, time).stream()
                .map(scheduleMapper)
                .toList();
    }

    @Override
    public List<ScheduleResponse> getAvailableSchedules(LocalDateTime start, LocalDateTime end) {
        logger.info("Fetching available schedules between: {} to {}", start, end);
        return scheduleRepository.findAvailableSchedules(start, end).stream()
                .map(scheduleMapper)
                .toList();
    }

    @Override
    public Long getScheduleCountByVehicleIdAndStatus(String vehicleId, String status) {
        logger.info("Getting schedule count by vehicle id: {} and status: {}", vehicleId, status);
        ScheduleStatus scheduleStatus = parseScheduleStatus(status);
        return scheduleRepository.countByVehicleIdAndStatus(vehicleId, scheduleStatus);
    }

    private ScheduleStatus parseScheduleStatus(String status) {
        logger.debug("Parsing schedule status: {}", status);
        if (status == null || status.trim().isEmpty()) {
            logger.error("Schedule status cannot be null or empty");
            throw new InvalidInputException("Schedule status cannot be null or empty");
        }
        try {
            ScheduleStatus result = ScheduleStatus.valueOf(status.trim().toUpperCase());
            logger.debug("Parsed schedule status: {}", result);
            return result;
        } catch (IllegalArgumentException e) {
            logger.error("Invalid schedule status: {}", status);
            throw new InvalidInputException("Invalid schedule status: " + status + ". Valid statuses are: " + java.util.Arrays.toString(ScheduleStatus.values()));
        }
    }
}
