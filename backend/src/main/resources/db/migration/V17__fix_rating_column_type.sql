-- Fix rating column type from DECIMAL to FLOAT
ALTER TABLE vehicles ALTER COLUMN rating TYPE FLOAT;
