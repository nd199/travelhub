-- Add payment_status column to bookings table
ALTER TABLE bookings ADD COLUMN payment_status VARCHAR(255) NOT NULL DEFAULT 'PENDING';

-- Add comment to the column
COMMENT ON COLUMN bookings.payment_status IS 'Payment status of the booking: PENDING, COMPLETED, FAILED, REFUNDED';
