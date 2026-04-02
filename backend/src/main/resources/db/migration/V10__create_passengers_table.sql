-- V10__create_passengers_table.sql
CREATE TABLE passengers (
    id VARCHAR(255) PRIMARY KEY,
    booking_id VARCHAR(255) NOT NULL,
    seat_id VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL,
    gender VARCHAR(255),
    contact_number VARCHAR(255),
    email VARCHAR(255),
    id_proof_type VARCHAR(255),
    id_proof_number VARCHAR(255),
    special_requirements TEXT,
    emergency_contact_name VARCHAR(255),
    emergency_contact_number VARCHAR(255),
    baggage_allowance INTEGER,
    checked_in BOOLEAN DEFAULT FALSE,
    check_in_time TIMESTAMP,
    seat_preference VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    CONSTRAINT fk_passengers_booking FOREIGN KEY (booking_id) REFERENCES bookings(id),
    CONSTRAINT fk_passengers_seat FOREIGN KEY (seat_id) REFERENCES seats(id)
);
