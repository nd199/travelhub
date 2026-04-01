package com.naren.backend.Service;

import com.naren.backend.DTO.ScheduleResponse;
import com.naren.backend.Record.ScheduleRequest;

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
}
