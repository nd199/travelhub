package com.naren.backend.service;

import com.naren.backend.dto.ScheduleResponse;
import com.naren.backend.record.ScheduleRequest;

import java.time.LocalDateTime;
import java.util.List;

public interface ScheduleServiceInterface {
    ScheduleResponse createSchedule(ScheduleRequest scheduleRequest);
    ScheduleResponse getScheduleById(String id);
    List<ScheduleResponse> getAllSchedules();
    List<ScheduleResponse> getSchedulesByVehicleId(String vehicleId);
    List<ScheduleResponse> getSchedulesByRouteId(String routeId);
    List<ScheduleResponse> getSchedulesByStatus(String status);
    List<ScheduleResponse> getSchedulesByDepartureTimeRange(LocalDateTime start, LocalDateTime end);
    List<ScheduleResponse> getActiveSchedulesByRoute(String routeId);
    ScheduleResponse updateSchedule(String id, ScheduleRequest scheduleRequest);
    void deleteSchedule(String id);
    
    List<ScheduleResponse> getSchedulesByDepartureTimeAfter(LocalDateTime time);
    List<ScheduleResponse> getSchedulesByDepartureTimeBefore(LocalDateTime time);
    List<ScheduleResponse> getSchedulesByArrivalTimeRange(LocalDateTime start, LocalDateTime end);
    List<ScheduleResponse> getSchedulesByVehicleIdAndDepartureTimeRange(String vehicleId, LocalDateTime start, LocalDateTime end);
    List<ScheduleResponse> getSchedulesByPriceRange(double minPrice, double maxPrice);
    List<ScheduleResponse> getSchedulesByAvailableSeatsGreaterThan(int minSeats);
    List<ScheduleResponse> getSchedulesByStatusAndDepartureTimeAfter(String status, LocalDateTime time);
    List<ScheduleResponse> getAvailableSchedules(LocalDateTime start, LocalDateTime end);
    Long getScheduleCountByVehicleIdAndStatus(String vehicleId, String status);
}
