package com.naren.backend.DTO.mapper;

import com.naren.backend.Entity.Passenger;
import com.naren.backend.DTO.PassengerResponse;
import org.springframework.stereotype.Component;

import java.util.function.Function;

@Component
public class PassengerMapper implements Function<Passenger, PassengerResponse> {

    @Override
    public PassengerResponse apply(Passenger passenger) {
        return new PassengerResponse(
                passenger.getId(),
                passenger.getBooking().getId(),
                passenger.getSeat() != null ? passenger.getSeat().getId() : null,
                passenger.getName(),
                passenger.getAge(),
                passenger.getGender() != null ? passenger.getGender().name() : null,
                passenger.getContactNumber(),
                passenger.getEmail(),
                passenger.getIdProofType(),
                passenger.getIdProofNumber(),
                passenger.getCreatedAt(),
                passenger.getUpdatedAt()
        );
    }
}
