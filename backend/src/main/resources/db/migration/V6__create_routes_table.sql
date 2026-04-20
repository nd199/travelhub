-- V6__create_routes_table.sql
CREATE TABLE routes
(
    id                         VARCHAR(255) PRIMARY KEY,
    source_location_id         VARCHAR(255) NOT NULL,
    destination_location_id    VARCHAR(255) NOT NULL,
    distance_km                DOUBLE PRECISION,
    estimated_duration_minutes INTEGER,
    description                TEXT,
    status                     VARCHAR(255) NOT NULL,
    created_at                 TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at                 TIMESTAMP,
    CONSTRAINT fk_routes_source FOREIGN KEY (source_location_id) REFERENCES locations (id),
    CONSTRAINT fk_routes_destination FOREIGN KEY (destination_location_id) REFERENCES locations (id)
);
