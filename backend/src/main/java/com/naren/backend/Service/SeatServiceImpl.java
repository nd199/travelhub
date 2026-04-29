package com.naren.backend.service;

import com.naren.backend.dto.SeatResponse;
import com.naren.backend.entity.Seat;
import com.naren.backend.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SeatServiceImpl implements SeatService {

    private final SeatRepository seatRepository;

    @Override
    public List<SeatResponse> getSeatsByVehicleId(String vehicleId) {
        List<Seat> seats = seatRepository.findByVehicleId(vehicleId);
        return seats.stream()
                .map(this::mapToSeatResponse)
                .collect(Collectors.toList());
    }

    @Override
    public SeatResponse getSeatById(String id) {
        return seatRepository.findById(id)
                .map(this::mapToSeatResponse)
                .orElse(null);
    }

    @Override
    public List<SeatResponse> getAvailableSeatsByVehicleId(String vehicleId) {
        List<Seat> seats = seatRepository.findByVehicleIdAndStatus(vehicleId, com.naren.backend.entity.SeatStatus.AVAILABLE);
        return seats.stream()
                .map(this::mapToSeatResponse)
                .collect(Collectors.toList());
    }

    private SeatResponse mapToSeatResponse(Seat seat) {
        return new SeatResponse(
                seat.getId(),
                seat.getVehicle() != null ? seat.getVehicle().getId() : null,
                seat.getSeatNumber(),
                seat.getType(),
                seat.getStatus().toString(),
                seat.getPrice(),
                seat.getCreatedAt(),
                seat.getUpdatedAt()
        );
    }
}
