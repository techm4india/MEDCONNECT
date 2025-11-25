-- Migration: Add NMC Alignment and 3D Curriculum Tools Support
-- Run this in your Supabase SQL Editor

-- Add NMC alignment fields to curriculum_modules
ALTER TABLE curriculum_modules 
ADD COLUMN IF NOT EXISTS nmc_aligned BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS nmc_competency_codes TEXT[] DEFAULT '{}';

-- Add 3D viewer fields to learning_resources
ALTER TABLE learning_resources
ADD COLUMN IF NOT EXISTS viewer_type TEXT CHECK (viewer_type IN ('anatomy', 'physiology', 'pathology', 'pharmacology', NULL)),
ADD COLUMN IF NOT EXISTS interactive BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS embed_code TEXT;

-- Create index for NMC-aligned modules
CREATE INDEX IF NOT EXISTS idx_curriculum_modules_nmc_aligned ON curriculum_modules(nmc_aligned);

-- Create index for 3D resources
CREATE INDEX IF NOT EXISTS idx_learning_resources_3d ON learning_resources(resource_type) WHERE resource_type = '3d';

-- Add comment for documentation
COMMENT ON COLUMN curriculum_modules.nmc_aligned IS 'Indicates if module is aligned with NMC (National Medical Commission) curriculum standards';
COMMENT ON COLUMN curriculum_modules.nmc_competency_codes IS 'Array of NMC competency codes this module addresses';
COMMENT ON COLUMN learning_resources.viewer_type IS 'Type of 3D viewer: anatomy, physiology, pathology, or pharmacology';
COMMENT ON COLUMN learning_resources.interactive IS 'Whether the 3D resource is interactive';
COMMENT ON COLUMN learning_resources.embed_code IS 'Embed code for 3D viewers or external interactive content';


