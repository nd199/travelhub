-- V7__create_schedules_table.sql
CREATE TABLE schedules
(
    id                    VARCHAR(255) PRIMARY KEY,
    vehicle_id            VARCHAR(255)     NOT NULL,
    route_id              VARCHAR(255)     NOT NULL,
    departure_time        TIMESTAMP        NOT NULL,
    arrival_time          TIMESTAMP        NOT NULL,
    actual_departure_time TIMESTAMP,
    actual_arrival_time   TIMESTAMP,
    price                 DOUBLE PRECISION NOT NULL,
    available_seats       INTEGER          NOT NULL,
    status                VARCHAR(255)     NOT NULL,
    created_at            TIMESTAMP        NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMP,
    schedule_code         VARCHAR(255),
    delay_minutes         INTEGER                   DEFAULT 0,
    delay_reason          TEXT,
    actual_arrival_delay  INTEGER                   DEFAULT 0,
    gate_number           VARCHAR(255),
    platform_number       VARCHAR(255),
    CONSTRAINT fk_schedules_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles (id),
    CONSTRAINT fk_schedules_route FOREIGN KEY (route_id) REFERENCES routes (id)
);
