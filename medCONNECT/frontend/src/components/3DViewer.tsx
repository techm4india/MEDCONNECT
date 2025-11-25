import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Maximize2, Minimize2, Image as ImageIcon, ZoomIn, ZoomOut, Download } from 'lucide-react'
import { MEDICAL_3D_MODELS, getModelById, getModelsByType } from '@/data/3dModels'

interface Viewer3DProps {
  title: string
  viewerType: 'anatomy' | 'physiology' | 'pathology' | 'pharmacology'
  embedCode?: string
  fileUrl?: string
}

// Popular free Sketchfab medical models (these are example URLs - replace with actual model IDs)
// To get real models: Go to sketchfab.com, search for "medical anatomy", find free models, copy embed URL
const SKETCHFAB_BASE = 'https://sketchfab.com/models'

// Example real Sketchfab model IDs (replace these with actual free model IDs from sketchfab.com)
const REAL_MODEL_IDS = {
  heart: 'bfc8e3b5e3b5e3b5e3b5e3b5e3b5e3b', // Replace with actual heart model ID
  lungs: 'b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2b2', // Replace with actual lung model ID
  brain: 'a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1', // Replace with actual brain model ID
  skeleton: 'c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3c3', // Replace with actual skeleton model ID
}

function getSketchfabEmbedUrl(modelId: string): string {
  return `${SKETCHFAB_BASE}/${modelId}/embed?autostart=0&ui_controls=1&ui_infos=1&ui_inspector=1&ui_stop=1&ui_watermark=1&ui_watermark_link=1`
}

// Map viewer types to specific 3D models using real Sketchfab models
const getModelUrl = (viewerType: string, title: string): string => {
  const lowerTitle = title.toLowerCase()
  
  // Try to find matching model from our database
  const matchingModel = MEDICAL_3D_MODELS.find(m => 
    m.title.toLowerCase().includes(lowerTitle) ||
    m.tags.some(tag => lowerTitle.includes(tag))
  )
  
  if (matchingModel) {
    return matchingModel.embedUrl
  }
  
  // Fallback: Use type-based models
  const typeModels = getModelsByType(viewerType)
  if (typeModels.length > 0) {
    return typeModels[0].embedUrl
  }
  
  // Ultimate fallback: Use BioDigital Human (free educational version - this works!)
  // This is a real working 3D model viewer from BioDigital
  return 'https://human.biodigital.com/widget/?m=default'
}

export function Viewer3D({ title, viewerType, embedCode, fileUrl }: Viewer3DProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoom, setZoom] = useState(1)

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    if (!isFullscreen) {
      setZoom(1)
    }
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5))
  }

  const handleDownload = () => {
    const imageUrl = fileUrl || embedCode || getModelUrl(viewerType, title)
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `${title.replace(/\s+/g, '-')}.jpg`
    link.target = '_blank'
    link.click()
  }

  // Determine the image URL
  const imageUrl = fileUrl || embedCode || getModelUrl(viewerType, title)

  return (
    <Card className={`border-2 ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-purple-600" />
          {title}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomOut}
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomIn}
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDownload}
            title="Download Image"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          className="w-full rounded-lg overflow-hidden border-2 border-purple-200 dark:border-purple-800 bg-gray-100 dark:bg-gray-900"
          style={{ 
            height: isFullscreen ? 'calc(100vh - 200px)' : '500px',
            position: 'relative',
            cursor: zoom > 1 ? 'zoom-in' : 'default'
          }}
        >
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-contain transition-transform duration-300"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'center center',
            }}
            onError={(e) => {
              // Fallback to a placeholder if image fails to load
              e.currentTarget.src = 'https://via.placeholder.com/800x600/667eea/ffffff?text=Medical+Anatomy+Image'
            }}
          />
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ImageIcon className="h-4 w-4" />
              Medical Anatomy Image
            </span>
            <span>Type: {viewerType}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Use zoom controls to examine details
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

