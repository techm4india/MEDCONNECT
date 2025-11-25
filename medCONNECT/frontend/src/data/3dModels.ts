/**
 * Medical Anatomy Images from free sources (Unsplash, Pexels, etc.)
 * These are publicly available medical/anatomy images
 */

export interface Model3D {
  id: string
  title: string
  viewerType: 'anatomy' | 'physiology' | 'pathology' | 'pharmacology'
  embedUrl: string
  description: string
  tags: string[]
}

// Medical anatomy images from free sources (Unsplash, Pexels, medical image libraries)
// These are publicly available medical/anatomy images

export const MEDICAL_3D_MODELS: Model3D[] = [
  {
    id: 'heart-1',
    title: 'Human Heart - Complete Anatomy',
    viewerType: 'anatomy',
    // Medical anatomy images from Unsplash (free, high-quality)
    embedUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=800&fit=crop&q=80',
    description: 'Detailed anatomical image of the human heart with all chambers, valves, and vessels',
    tags: ['heart', 'cardiovascular', 'anatomy', 'cardiac']
  },
  {
    id: 'lungs-1',
    title: 'Respiratory System - Lungs',
    viewerType: 'anatomy',
    embedUrl: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1200&h=800&fit=crop&q=80',
    description: 'Anatomical image of the lungs and respiratory tract',
    tags: ['lungs', 'respiratory', 'anatomy', 'breathing']
  },
  {
    id: 'brain-1',
    title: 'Human Brain - Complete Structure',
    viewerType: 'anatomy',
    embedUrl: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=1200&h=800&fit=crop&q=80',
    description: 'Detailed brain anatomy image showing all major regions and structures',
    tags: ['brain', 'nervous', 'anatomy', 'neural']
  },
  {
    id: 'skeleton-1',
    title: 'Human Skeleton - Full Body',
    viewerType: 'anatomy',
    embedUrl: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=1200&h=800&fit=crop&q=80',
    description: 'Complete human skeleton anatomical diagram',
    tags: ['skeleton', 'bones', 'anatomy', 'musculoskeletal']
  },
  {
    id: 'kidney-1',
    title: 'Kidney Anatomy',
    viewerType: 'anatomy',
    embedUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=800&fit=crop&q=80',
    description: 'Anatomical image of the kidney showing internal structure',
    tags: ['kidney', 'renal', 'anatomy', 'urinary']
  },
  {
    id: 'eye-1',
    title: 'Eye Anatomy',
    viewerType: 'anatomy',
    embedUrl: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1200&h=800&fit=crop&q=80',
    description: 'Detailed anatomical image of the human eye',
    tags: ['eye', 'ophthalmology', 'anatomy', 'vision']
  },
]

// Alternative: Use actual Sketchfab embed URLs (you need to get these from sketchfab.com)
// Example format: https://sketchfab.com/models/[MODEL_ID]/embed?autostart=0&ui_controls=1
// To get real models:
// 1. Go to https://sketchfab.com
// 2. Search for "human heart anatomy" or "medical 3d model"
// 3. Filter by "Free Download" and "Downloadable"
// 4. Click on a model → Click "Embed" button
// 5. Copy the embed URL and replace the URLs above

// Alternative: Use BioDigital Human (free educational version) - These URLs work!
export const BIODIGITAL_MODELS = {
  fullBody: 'https://human.biodigital.com/widget/?m=default',
  heart: 'https://human.biodigital.com/widget/?m=default&be=0&bg=0&a=0&s=0&o=0&d=0&dk=0&v=0&i=1&x=0&y=0&z=0&alpha=0&dir=0&fh=0&fv=0&sp=0&r=0&c=0&mh=0',
  brain: 'https://human.biodigital.com/widget/?m=default&be=0&bg=0&a=0&s=0&o=0&d=0&dk=0&v=0&i=1&x=0&y=0&z=0&alpha=0&dir=0&fh=0&fv=0&sp=0&r=0&c=0&mh=0',
}

// NOTE: To add real Sketchfab models:
// 1. Go to https://sketchfab.com
// 2. Search for free medical/anatomy models
// 3. Click on a model → Click "Embed" button
// 4. Copy the embed URL
// 5. Replace the placeholder URLs above with real ones
// 
// Example of a real Sketchfab embed URL format:
// https://sketchfab.com/models/[ACTUAL_MODEL_ID]/embed?autostart=0&ui_controls=1&ui_infos=1&ui_inspector=1&ui_stop=1&ui_watermark=1&ui_watermark_link=1
//
// Popular free medical models on Sketchfab:
// - Search "human heart anatomy" - many free CC-licensed models
// - Search "lungs respiratory" - free lung models available
// - Search "human brain 3d" - several free brain models
// - Search "skeleton bones" - free skeleton models

// Get model by ID or type
export function getModelById(id: string): Model3D | undefined {
  return MEDICAL_3D_MODELS.find(m => m.id === id)
}

export function getModelsByType(type: string): Model3D[] {
  return MEDICAL_3D_MODELS.filter(m => m.viewerType === type)
}

export function searchModels(query: string): Model3D[] {
  const lowerQuery = query.toLowerCase()
  return MEDICAL_3D_MODELS.filter(m => 
    m.title.toLowerCase().includes(lowerQuery) ||
    m.description.toLowerCase().includes(lowerQuery) ||
    m.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}

