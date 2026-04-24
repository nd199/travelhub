-- Add rating, reviews, and peoples_choice columns to vehicles table
ALTER TABLE vehicles ADD COLUMN rating FLOAT;
ALTER TABLE vehicles ADD COLUMN reviews INTEGER;
ALTER TABLE vehicles ADD COLUMN peoples_choice VARCHAR(500);

-- Update existing vehicles with sample data
UPDATE vehicles SET rating = 4.2 WHERE rating IS NULL;
UPDATE vehicles SET reviews = 1250 WHERE reviews IS NULL;
UPDATE vehicles SET peoples_choice = 'Safety,Punctuality' WHERE peoples_choice IS NULL;
