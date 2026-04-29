package com.naren.backend.controller;

import com.naren.backend.dto.BoardingPointResponse;
import com.naren.backend.service.BoardingPointService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/boarding-points")
@Tag(name = "Boarding Points")
public class BoardingPointController {

    private final BoardingPointService boardingPointService;

    public BoardingPointController(BoardingPointService boardingPointService) {
        this.boardingPointService = boardingPointService;
    }

    @GetMapping("/route/{routeId}")
    public ResponseEntity<List<BoardingPointResponse>> getBoardingPointsByRoute(@PathVariable String routeId) {
        return ResponseEntity.ok(boardingPointService.getBoardingPointsByRoute(routeId));
    }

    @GetMapping("/location/{locationId}")
    public ResponseEntity<List<BoardingPointResponse>> getBoardingPointsByLocation(@PathVariable String locationId) {
        return ResponseEntity.ok(boardingPointService.getBoardingPointsByLocation(locationId));
    }

    @GetMapping("/boarding")
    public ResponseEntity<List<BoardingPointResponse>> getBoardingPoints() {
        return ResponseEntity.ok(boardingPointService.getBoardingPoints());
    }

    @GetMapping("/dropping")
    public ResponseEntity<List<BoardingPointResponse>> getDroppingPoints() {
        return ResponseEntity.ok(boardingPointService.getDroppingPoints());
    }
}
