-- V14__fix_enum_values.sql
-- This migration converts any lowercase enum values to uppercase to match Java enum constants
-- It ensures compatibility with Java's EnumType.STRING which expects exact case matches

-- Schedules table: fix status column
UPDATE schedules 
SET status = UPPER(status) 
WHERE status = LOWER(status) 
  AND status IN ('scheduled', 'active', 'completed', 'cancelled', 'delayed');

-- Seats table: fix status column
UPDATE seats 
SET status = UPPER(status) 
WHERE status = LOWER(status) 
  AND status IN ('available', 'booked', 'reserved', 'blocked');

-- Vehicles table: fix status column
UPDATE vehicles 
SET status = UPPER(status) 
WHERE status = LOWER(status) 
  AND status IN ('active', 'inactive', 'maintenance', 'retired');

-- Routes table: fix status column
UPDATE routes 
SET status = UPPER(status) 
WHERE status = LOWER(status) 
  AND status IN ('active', 'inactive', 'suspended');

-- Bookings table: fix status column
UPDATE bookings 
SET status = UPPER(status) 
WHERE status = LOWER(status) 
  AND status IN ('pending', 'confirmed', 'cancelled', 'completed');

-- Bookings table: fix payment_status column
UPDATE bookings 
SET payment_status = UPPER(payment_status) 
WHERE payment_status = LOWER(payment_status) 
  AND payment_status IN ('pending', 'completed', 'failed', 'refunded');

-- Payments table: fix status column
UPDATE payments 
SET status = UPPER(status) 
WHERE status = LOWER(status) 
  AND status IN ('pending', 'completed', 'failed', 'refunded');

-- Transactions table: fix status column (uses PaymentStatus enum)
UPDATE transactions 
SET status = UPPER(status) 
WHERE status = LOWER(status) 
  AND status IN ('pending', 'completed', 'failed', 'refunded');
