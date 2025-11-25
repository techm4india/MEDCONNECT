# 3D Models Integration Guide

This guide explains how to add real 3D models from the internet to MedConnect.

## Using Sketchfab Models

Sketchfab is a popular platform with thousands of free medical 3D models that can be embedded.

### Steps to Add a Real Sketchfab Model:

1. **Find a Free Model:**
   - Go to [sketchfab.com](https://sketchfab.com)
   - Search for medical/anatomy models (e.g., "human heart", "lungs", "brain")
   - Filter by "Free Download" or "Downloadable"
   - Look for models with "CC" (Creative Commons) license

2. **Get the Embed URL:**
   - Click on a model you like
   - Click the "Embed" button (usually in the bottom right)
   - Copy the embed URL
   - It should look like: `https://sketchfab.com/models/[MODEL_ID]/embed?autostart=0&ui_controls=1...`

3. **Add to Your Code:**
   - Update `frontend/src/data/3dModels.ts` with the real embed URL
   - Or add it directly in `frontend/src/pages/Academic.tsx` in the resources array

### Example Real Sketchfab Models:

Here are some popular free medical models you can use:

- **Heart Models:** Search "human heart anatomy" on Sketchfab
- **Brain Models:** Search "human brain 3d" on Sketchfab  
- **Lung Models:** Search "lungs respiratory system" on Sketchfab
- **Skeleton:** Search "human skeleton" on Sketchfab

### Alternative: BioDigital Human

BioDigital Human offers a free educational widget that can be embedded:

```javascript
const biodigitalUrl = 'https://human.biodigital.com/widget/?m=default'
```

This provides a full interactive human body model.

### Alternative: Visible Body

Visible Body also offers embeddable 3D models (may require subscription for full access).

## Current Implementation

The current code uses placeholder Sketchfab model IDs. To use real models:

1. Replace the placeholder IDs in `frontend/src/data/3dModels.ts`
2. Or update the embed URLs in `frontend/src/pages/Academic.tsx`

## Testing

After adding real model URLs:
1. Open the Academic page
2. Select a subject → Module → 3D Resource
3. The model should load in an iframe
4. Users can interact with it (rotate, zoom, etc.)

## License Notes

Always check the license of 3D models:
- **CC0 / Public Domain:** Free to use for any purpose
- **CC BY:** Free to use with attribution
- **CC BY-NC:** Free for non-commercial use
- **All Rights Reserved:** May require permission/license

For educational purposes, most CC-licensed models are acceptable.


