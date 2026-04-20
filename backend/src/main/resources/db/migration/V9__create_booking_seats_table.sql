-- V9__create_booking_seats_table.sql
CREATE TABLE booking_seats
(
    id         VARCHAR(255) PRIMARY KEY,
    booking_id VARCHAR(255)     NOT NULL,
    seat_id    VARCHAR(255)     NOT NULL,
    price      DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP        NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_booking_seats_booking FOREIGN KEY (booking_id) REFERENCES bookings (id),
    CONSTRAINT fk_booking_seats_seat FOREIGN KEY (seat_id) REFERENCES seats (id)
);
