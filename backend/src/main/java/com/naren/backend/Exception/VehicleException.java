package com.naren.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class VehicleException extends RuntimeException {

    public VehicleException(String message) {
        super(message);
    }
}
