-- Fix Plants Table Schema and Restore Default Plants
-- Run this in your Supabase SQL Editor

-- First, let's update the plants table to include all the missing columns
ALTER TABLE plants ADD COLUMN IF NOT EXISTS species TEXT;
ALTER TABLE plants ADD COLUMN IF NOT EXISTS last_watered TIMESTAMP WITH TIME ZONE;
ALTER TABLE plants ADD COLUMN IF NOT EXISTS watering_frequency INTEGER DEFAULT 7;
ALTER TABLE plants ADD COLUMN IF NOT EXISTS humidity_needs TEXT DEFAULT 'medium';
ALTER TABLE plants ADD COLUMN IF NOT EXISTS temperature_range TEXT DEFAULT '18-24°C';
ALTER TABLE plants ADD COLUMN IF NOT EXISTS fertilizer_frequency INTEGER DEFAULT 4;
ALTER TABLE plants ADD COLUMN IF NOT EXISTS last_fertilized TIMESTAMP WITH TIME ZONE;
ALTER TABLE plants ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE plants ADD COLUMN IF NOT EXISTS size TEXT DEFAULT 'medium';
ALTER TABLE plants ADD COLUMN IF NOT EXISTS pot_size TEXT;
ALTER TABLE plants ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE plants ADD COLUMN IF NOT EXISTS pot_color TEXT DEFAULT '#8B4513';
ALTER TABLE plants ADD COLUMN IF NOT EXISTS plant_type TEXT DEFAULT 'tropical';

-- Update the existing columns to match the expected schema
ALTER TABLE plants ALTER COLUMN light_needs SET DEFAULT 'medium';
ALTER TABLE plants ALTER COLUMN health SET DEFAULT 'healthy';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_plants_next_watering ON plants(next_watering);
CREATE INDEX IF NOT EXISTS idx_plants_health ON plants(health);
CREATE INDEX IF NOT EXISTS idx_plants_type ON plants(plant_type);

-- Now let's insert the default plants
INSERT INTO plants (
    name, 
    species, 
    location, 
    last_watered, 
    next_watering, 
    watering_frequency, 
    light_needs, 
    humidity_needs, 
    temperature_range, 
    fertilizer_frequency, 
    last_fertilized, 
    notes, 
    health, 
    size, 
    pot_size, 
    care_tasks, 
    pot_color, 
    plant_type
) VALUES 
(
    'Spider Plant',
    'Chlorophytum comosum',
    'Living Room',
    (NOW() - INTERVAL '2 days'),
    (NOW() + INTERVAL '2 days'),
    4,
    'medium',
    'medium',
    '18-24°C',
    14,
    (NOW() - INTERVAL '7 days'),
    'Loves bright indirect light and regular watering',
    'excellent',
    'medium',
    '6 inch',
    '[]',
    '#8B4513',
    'tropical'
),
(
    'Monstera',
    'Monstera deliciosa',
    'Living Room',
    (NOW() - INTERVAL '1 day'),
    (NOW() + INTERVAL '3 days'),
    4,
    'medium',
    'high',
    '18-24°C',
    14,
    (NOW() - INTERVAL '10 days'),
    'Famous for its distinctive leaves with natural holes',
    'good',
    'large',
    '12 inch',
    '[]',
    '#A0522D',
    'tropical'
),
(
    'Snake Plant',
    'Sansevieria trifasciata',
    'Bedroom',
    (NOW() - INTERVAL '3 days'),
    (NOW() + INTERVAL '4 days'),
    7,
    'low',
    'low',
    '16-24°C',
    21,
    (NOW() - INTERVAL '14 days'),
    'Perfect for beginners - very low maintenance',
    'excellent',
    'medium',
    '8 inch',
    '[]',
    '#CD853F',
    'succulent'
),
(
    'Golden Pothos',
    'Epipremnum aureum',
    'Kitchen',
    (NOW() - INTERVAL '1 day'),
    (NOW() + INTERVAL '3 days'),
    4,
    'medium',
    'medium',
    '18-24°C',
    14,
    (NOW() - INTERVAL '8 days'),
    'Trailing vine that purifies the air',
    'good',
    'medium',
    '6 inch',
    '[]',
    '#D2691E',
    'tropical'
),
(
    'Peace Lily',
    'Spathiphyllum',
    'Office',
    (NOW() - INTERVAL '2 days'),
    (NOW() + INTERVAL '2 days'),
    3,
    'medium',
    'high',
    '18-24°C',
    14,
    (NOW() - INTERVAL '5 days'),
    'Great air purifier and beautiful white flowers',
    'excellent',
    'medium',
    '8 inch',
    '[]',
    '#8FBC8F',
    'tropical'
),
(
    'Aloe Vera',
    'Aloe barbadensis',
    'Kitchen',
    (NOW() - INTERVAL '5 days'),
    (NOW() + INTERVAL '7 days'),
    7,
    'high',
    'low',
    '18-24°C',
    21,
    (NOW() - INTERVAL '21 days'),
    'Medicinal plant that loves bright light',
    'good',
    'medium',
    '6 inch',
    '[]',
    '#228B22',
    'succulent'
),
(
    'Basil',
    'Ocimum basilicum',
    'Kitchen',
    (NOW() - INTERVAL '1 day'),
    (NOW() + INTERVAL '2 days'),
    2,
    'high',
    'medium',
    '18-24°C',
    7,
    (NOW() - INTERVAL '3 days'),
    'Aromatic herb perfect for cooking',
    'excellent',
    'small',
    '4 inch',
    '[]',
    '#8FBC8F',
    'herb'
)
ON CONFLICT (name) DO NOTHING;

-- Verify the plants were added
SELECT name, species, location, health FROM plants ORDER BY created_at;
