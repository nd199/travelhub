package com.naren.backend.DTO.mapper;

import com.naren.backend.Entity.Seat;
import com.naren.backend.Record.SeatResponse;
import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
public class SeatMapper implements Function<Seat, SeatResponse> {

    @Override
    public SeatResponse apply(Seat seat) {
        return new SeatResponse(
                seat.getId(),
                seat.getVehicle().getId(),
                seat.getSeatNumber(),
                seat.getType(),
                seat.getStatus().name(),
                seat.getPrice(),
                seat.getCreatedAt(),
                seat.getUpdatedAt()
        );
    }
}
