-- V11__create_payments_table.sql
CREATE TABLE payments (
    id VARCHAR(255) PRIMARY KEY,
    booking_id VARCHAR(255) NOT NULL,
    amount DOUBLE PRECISION NOT NULL,
    currency VARCHAR(255) NOT NULL DEFAULT 'INR',
    status VARCHAR(255) NOT NULL,
    method VARCHAR(255) NOT NULL,
    gateway_name VARCHAR(255),
    transaction_reference VARCHAR(255),
    gateway_transaction_id VARCHAR(255),
    gateway_response TEXT,
    refund_amount DOUBLE PRECISION,
    refund_date TIMESTAMP,
    refund_reason TEXT,
    payment_failure_reason TEXT,
    retry_count INTEGER DEFAULT 0,
    partial_payment BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    CONSTRAINT fk_payments_booking FOREIGN KEY (booking_id) REFERENCES bookings(id)
);
