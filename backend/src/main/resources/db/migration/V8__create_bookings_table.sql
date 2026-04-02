-- V8__create_bookings_table.sql
CREATE TABLE bookings (
    id VARCHAR(255) PRIMARY KEY,
    booking_reference VARCHAR(255) NOT NULL UNIQUE,
    user_id VARCHAR(255) NOT NULL,
    schedule_id VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    total_amount DOUBLE PRECISION NOT NULL,
    discount_amount DOUBLE PRECISION,
    tax_amount DOUBLE PRECISION,
    final_amount DOUBLE PRECISION,
    travel_date TIMESTAMP NOT NULL,
    booking_source VARCHAR(255),
    cancelled_at TIMESTAMP,
    cancellation_reason TEXT,
    refund_amount DOUBLE PRECISION,
    modified_at TIMESTAMP,
    modification_reason TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_bookings_schedule FOREIGN KEY (schedule_id) REFERENCES schedules(id)
);
