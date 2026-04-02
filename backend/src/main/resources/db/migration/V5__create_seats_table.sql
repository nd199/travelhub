-- V5__create_seats_table.sql
CREATE TABLE seats (
    id VARCHAR(255) PRIMARY KEY,
    vehicle_id VARCHAR(255) NOT NULL,
    seat_number VARCHAR(255) NOT NULL,
    type VARCHAR(255),
    status VARCHAR(255) NOT NULL,
    price DOUBLE PRECISION,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    CONSTRAINT fk_seats_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);
