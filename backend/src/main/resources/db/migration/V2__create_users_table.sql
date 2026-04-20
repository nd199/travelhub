-- V2__create_users_table.sql
CREATE TABLE users
(
    id                VARCHAR(255) PRIMARY KEY,
    email             VARCHAR(255) NOT NULL UNIQUE,
    password          VARCHAR(255) NOT NULL,
    first_name        VARCHAR(255) NOT NULL,
    last_name         VARCHAR(255) NOT NULL,
    phone_number      VARCHAR(255),
    profile_image_url VARCHAR(255),
    gender            VARCHAR(255),
    role_id           VARCHAR(255) NOT NULL,
    active            BOOLEAN               DEFAULT TRUE,
    created_at        TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMP,
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles (id)
);
