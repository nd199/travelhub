package com.naren.backend.controller;

import com.naren.backend.service.DataSeedingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/seed")
@RequiredArgsConstructor
@Slf4j
public class DataSeedingController {

    private final DataSeedingService dataSeedingService;

    @PostMapping("/all")
    @Operation(summary = "Seed all sample data", description = "Populates the database with sample data for locations, vehicles, routes, schedules, and seats")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Data seeded successfully"),
            @ApiResponse(responseCode = "500", description = "Error occurred while seeding data")
    })
    public ResponseEntity<String> seedAllData() {
        try {
            log.info("Received request to seed all data");
            dataSeedingService.seedAllData();
            return ResponseEntity.ok("Data seeded successfully!");
        } catch (Exception e) {
            log.error("Error occurred while seeding data", e);
            return ResponseEntity.internalServerError().body("Error occurred while seeding data: " + e.getMessage());
        }
    }

    @DeleteMapping("/all")
    @Operation(summary = "Clear all data", description = "Removes all data from the database")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Data cleared successfully"),
            @ApiResponse(responseCode = "500", description = "Error occurred while clearing data")
    })
    public ResponseEntity<String> clearAllData() {
        try {
            log.info("Received request to clear all data");
            dataSeedingService.clearAllData();
            return ResponseEntity.ok("Data cleared successfully!");
        } catch (Exception e) {
            log.error("Error occurred while clearing data", e);
            return ResponseEntity.internalServerError().body("Error occurred while clearing data: " + e.getMessage());
        }
    }
}
