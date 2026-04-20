package com.naren.backend.service;

import com.naren.backend.dto.ScheduleRequest;
import com.naren.backend.dto.ScheduleResponse;

import java.util.List;

public interface ScheduleService {
    
    ScheduleResponse createSchedule(ScheduleRequest request);
    
    ScheduleResponse getScheduleById(String id);
    
    List<ScheduleResponse> getAllSchedules();
    
    List<ScheduleResponse> getSchedulesByVehicleId(String vehicleId);
    
    List<ScheduleResponse> getSchedulesByRouteId(String routeId);
    
    List<ScheduleResponse> getSchedulesByStatus(String status);
    
    ScheduleResponse updateSchedule(String id, ScheduleRequest request);
    
    void deleteSchedule(String id);
}
