-- V12__create_transactions_table.sql
CREATE TABLE transactions
(
    id                     VARCHAR(255) PRIMARY KEY,
    payment_id             VARCHAR(255)     NOT NULL,
    transaction_reference  VARCHAR(255)     NOT NULL UNIQUE,
    amount                 DOUBLE PRECISION NOT NULL,
    currency               VARCHAR(255)     NOT NULL DEFAULT 'INR',
    gateway_name           VARCHAR(255),
    gateway_transaction_id VARCHAR(255),
    gateway_response       TEXT             NOT NULL,
    status                 VARCHAR(255)     NOT NULL,
    created_at             TIMESTAMP        NOT NULL DEFAULT NOW(),
    updated_at             TIMESTAMP,
    CONSTRAINT fk_transactions_payment FOREIGN KEY (payment_id) REFERENCES payments (id)
);
