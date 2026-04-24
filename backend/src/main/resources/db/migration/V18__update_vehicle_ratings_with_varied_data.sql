-- Update vehicles with varied ratings, reviews, and peoplesChoice data
UPDATE vehicles SET rating = 4.7, reviews = 3250, peoples_choice = 'Safety,Comfort,Luxury' WHERE name ILIKE '%Volvo%' OR name ILIKE '%Scania%';
UPDATE vehicles SET rating = 4.3, reviews = 2150, peoples_choice = 'Safety,Punctuality,Affordability' WHERE name ILIKE '%KSRTC%' OR name ILIKE '%APSRTC%';
UPDATE vehicles SET rating = 4.1, reviews = 1850, peoples_choice = 'Comfort,Safety,Cleanliness' WHERE name ILIKE '%Sleeper%' AND (name NOT ILIKE '%Volvo%' AND name NOT ILIKE '%Scania%');
UPDATE vehicles SET rating = 3.9, reviews = 1250, peoples_choice = 'Value,Punctuality,Service' WHERE name ILIKE '%Seater%' AND (name NOT ILIKE '%Volvo%' AND name NOT ILIKE '%Scania%' AND name NOT ILIKE '%KSRTC%' AND name NOT ILIKE '%APSRTC%');
UPDATE vehicles SET rating = 3.7, reviews = 850, peoples_choice = 'Safety,Reliability' WHERE name ILIKE '%Non-AC%';
