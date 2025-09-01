-- Fix Plants Table Schema - Final Corrected Version
-- Run this in your Supabase SQL Editor

-- First, let's check what columns currently exist
DO $$
DECLARE
    col_exists BOOLEAN;
BEGIN
    -- Check and add species column
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'plants' AND column_name = 'species'
    ) INTO col_exists;
    
    IF NOT col_exists THEN
        ALTER TABLE plants ADD COLUMN species TEXT;
    END IF;

    -- Check and add last_watered column
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'plants' AND column_name = 'last_watered'
    ) INTO col_exists;
    
    IF NOT col_exists THEN
        ALTER TABLE plants ADD COLUMN last_watered TIMESTAMP WITH TIME ZONE;
    END IF;

    -- Check and add watering_frequency column
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'plants' AND column_name = 'watering_frequency'
    ) INTO col_exists;
    
    IF NOT col_exists THEN
        ALTER TABLE plants ADD COLUMN watering_frequency INTEGER DEFAULT 7;
    END IF;

    -- Check and add humidity_needs column
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'plants' AND column_name = 'humidity_needs'
    ) INTO col_exists;
    
    IF NOT col_exists THEN
        ALTER TABLE plants ADD COLUMN humidity_needs TEXT DEFAULT 'medium';
    END IF;

    -- Check and add temperature_range column
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'plants' AND column_name = 'temperature_range'
    ) INTO col_exists;
    
    IF NOT col_exists THEN
        ALTER TABLE plants ADD COLUMN temperature_range TEXT DEFAULT '18-24°C';
    END IF;

    -- Check and add fertilizer_frequency column
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'plants' AND column_name = 'fertilizer_frequency'
    ) INTO col_exists;
    
    IF NOT col_exists THEN
        ALTER TABLE plants ADD COLUMN fertilizer_frequency INTEGER DEFAULT 4;
    END IF;

    -- Check and add last_fertilized column
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'plants' AND column_name = 'last_fertilized'
    ) INTO col_exists;
    
    IF NOT col_exists THEN
        ALTER TABLE plants ADD COLUMN last_fertilized TIMESTAMP WITH TIME ZONE;
    END IF;

    -- Check and add notes column
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'plants' AND column_name = 'notes'
    ) INTO col_exists;
    
    IF NOT col_exists THEN
        ALTER TABLE plants ADD COLUMN notes TEXT;
    END IF;

    -- Check and add size column
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'plants' AND column_name = 'size'
    ) INTO col_exists;
    
    IF NOT col_exists THEN
        ALTER TABLE plants ADD COLUMN size TEXT DEFAULT 'medium';
    END IF;

    -- Check and add pot_size column
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'plants' AND column_name = 'pot_size'
    ) INTO col_exists;
    
    IF NOT col_exists THEN
        ALTER TABLE plants ADD COLUMN pot_size TEXT;
    END IF;

    -- Check and add image_url column
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'plants' AND column_name = 'image_url'
    ) INTO col_exists;
    
    IF NOT col_exists THEN
        ALTER TABLE plants ADD COLUMN image_url TEXT;
    END IF;

    -- Check and add pot_color column
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'plants' AND column_name = 'pot_color'
    ) INTO col_exists;
    
    IF NOT col_exists THEN
        ALTER TABLE plants ADD COLUMN pot_color TEXT DEFAULT '#8B4513';
    END IF;

    -- Check and add plant_type column
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'plants' AND column_name = 'plant_type'
    ) INTO col_exists;
    
    IF NOT col_exists THEN
        ALTER TABLE plants ADD COLUMN plant_type TEXT DEFAULT 'tropical';
    END IF;

    -- Check and add light_needs column (this was missing!)
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'plants' AND column_name = 'light_needs'
    ) INTO col_exists;
    
    IF NOT col_exists THEN
        ALTER TABLE plants ADD COLUMN light_needs TEXT DEFAULT 'medium';
    END IF;

    -- Check and add health column
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'plants' AND column_name = 'health'
    ) INTO col_exists;
    
    IF NOT col_exists THEN
        ALTER TABLE plants ADD COLUMN health TEXT DEFAULT 'healthy';
    END IF;

    -- Check and add next_watering column
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'plants' AND column_name = 'next_watering'
    ) INTO col_exists;
    
    IF NOT col_exists THEN
        ALTER TABLE plants ADD COLUMN next_watering TIMESTAMP WITH TIME ZONE;
    END IF;

    -- Check and add care_tasks column
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'plants' AND column_name = 'care_tasks'
    ) INTO col_exists;
    
    IF NOT col_exists THEN
        ALTER TABLE plants ADD COLUMN care_tasks JSONB;
    END IF;

END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_plants_next_watering ON plants(next_watering);
CREATE INDEX IF NOT EXISTS idx_plants_health ON plants(health);
CREATE INDEX IF NOT EXISTS idx_plants_type ON plants(plant_type);

-- Now let's insert the default plants (only if no plants exist)
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
) 
SELECT * FROM (
    VALUES 
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
        '[]'::jsonb,
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
        '[]'::jsonb,
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
        '[]'::jsonb,
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
        '[]'::jsonb,
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
        '[]'::jsonb,
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
        '[]'::jsonb,
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
        '[]'::jsonb,
        '#8FBC8F',
        'herb'
    )
) AS new_plants
WHERE NOT EXISTS (SELECT 1 FROM plants WHERE plants.name = new_plants.column1);

-- Verify the plants were added
SELECT name, species, location, health FROM plants ORDER BY created_at;
