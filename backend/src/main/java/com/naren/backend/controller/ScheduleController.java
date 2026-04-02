package com.naren.backend.controller;

import com.naren.backend.dto.ScheduleResponse;
import com.naren.backend.record.ScheduleRequest;
import com.naren.backend.service.ScheduleServiceInterface;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@Tag(name = "Schedule", description = "Schedule management APIs")
public class ScheduleController {

    private final ScheduleServiceInterface scheduleService;

    public ScheduleController(ScheduleServiceInterface scheduleService) {
        this.scheduleService = scheduleService;
    }

    @PostMapping
    @Operation(summary = "Create a new schedule")
    public ResponseEntity<ScheduleResponse> createSchedule(@Valid @RequestBody ScheduleRequest request) {
        return new ResponseEntity<>(scheduleService.createSchedule(request), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get schedule by ID")
    public ResponseEntity<ScheduleResponse> getScheduleById(@PathVariable String id) {
        return ResponseEntity.ok(scheduleService.getScheduleById(id));
    }

    @GetMapping
    @Operation(summary = "Get all schedules")
    public ResponseEntity<List<ScheduleResponse>> getAllSchedules() {
        return ResponseEntity.ok(scheduleService.getAllSchedules());
    }

    @GetMapping("/vehicle/{vehicleId}")
    @Operation(summary = "Get schedules by vehicle ID")
    public ResponseEntity<List<ScheduleResponse>> getSchedulesByVehicleId(@PathVariable String vehicleId) {
        return ResponseEntity.ok(scheduleService.getSchedulesByVehicleId(vehicleId));
    }

    @GetMapping("/route/{routeId}")
    @Operation(summary = "Get schedules by route ID")
    public ResponseEntity<List<ScheduleResponse>> getSchedulesByRouteId(@PathVariable String routeId) {
        return ResponseEntity.ok(scheduleService.getSchedulesByRouteId(routeId));
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get schedules by status")
    public ResponseEntity<List<ScheduleResponse>> getSchedulesByStatus(@PathVariable String status) {
        return ResponseEntity.ok(scheduleService.getSchedulesByStatus(status));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update schedule")
    public ResponseEntity<ScheduleResponse> updateSchedule(@PathVariable String id, @Valid @RequestBody ScheduleRequest request) {
        return ResponseEntity.ok(scheduleService.updateSchedule(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete schedule")
    public ResponseEntity<Void> deleteSchedule(@PathVariable String id) {
        scheduleService.deleteSchedule(id);
        return ResponseEntity.noContent().build();
    }
}
