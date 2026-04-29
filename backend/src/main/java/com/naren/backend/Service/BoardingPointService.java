package com.naren.backend.service;

import com.naren.backend.dto.BoardingPointResponse;
import com.naren.backend.entity.BoardingPoint;
import com.naren.backend.entity.BoardingPointType;
import com.naren.backend.repository.BoardingPointRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BoardingPointService {

    private final BoardingPointRepository boardingPointRepository;
    
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(BoardingPointService.class);

    public List<BoardingPointResponse> getBoardingPointsByRoute(String routeId) {
        log.info("Fetching boarding points for route: {}", routeId);
        List<BoardingPoint> boardingPoints = boardingPointRepository.findAll();
        return boardingPoints.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<BoardingPointResponse> getBoardingPointsByLocation(String locationId) {
        log.info("Fetching boarding points for location: {}", locationId);
        List<BoardingPoint> boardingPoints = boardingPointRepository.findByLocationId(locationId);
        return boardingPoints.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<BoardingPointResponse> getBoardingPoints() {
        log.info("Fetching all boarding points");
        List<BoardingPoint> boardingPoints = boardingPointRepository.findByType(BoardingPointType.BOARDING);
        return boardingPoints.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<BoardingPointResponse> getDroppingPoints() {
        log.info("Fetching all dropping points");
        List<BoardingPoint> droppingPoints = boardingPointRepository.findByType(BoardingPointType.DROPPING);
        return droppingPoints.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private BoardingPointResponse convertToResponse(BoardingPoint boardingPoint) {
        return new BoardingPointResponse(
                boardingPoint.getId(),
                boardingPoint.getLocation().getId(),
                boardingPoint.getLocation().getName(),
                boardingPoint.getPointName(),
                boardingPoint.getAddress(),
                boardingPoint.getTime(),
                boardingPoint.getLandmark(),
                boardingPoint.getType().name(),
                boardingPoint.getCreatedAt()
        );
    }
}
