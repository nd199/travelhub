-- Add bus_kind column to vehicles table
ALTER TABLE vehicles ADD COLUMN bus_kind VARCHAR(100);

-- Update existing vehicles with default bus kinds
UPDATE vehicles SET bus_kind = 'A/C Seater (2+2)' WHERE bus_kind IS NULL;
