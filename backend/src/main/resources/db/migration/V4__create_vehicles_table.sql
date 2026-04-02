-- V4__create_vehicles_table.sql
CREATE TABLE vehicles (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    capacity INTEGER NOT NULL,
    amenities TEXT,
    status VARCHAR(255) NOT NULL,
    registration_number VARCHAR(255) UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP
);
