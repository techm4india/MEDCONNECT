import { useRef, useEffect } from 'react'

interface ModelViewerProps {
  src: string
  alt?: string
  className?: string
  style?: React.CSSProperties
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any
    }
  }
}

export function ModelViewer({ src, alt = '3D Model', className, style }: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // If it's a Sketchfab embed URL, use iframe
  if (src.includes('sketchfab.com')) {
    return (
      <iframe
        src={src}
        className={className}
        style={{ width: '100%', height: '100%', border: 'none', ...style }}
        allow="autoplay; fullscreen; xr-spatial-tracking"
        allowFullScreen
        title={alt}
      />
    )
  }

  // Use model-viewer for GLB/GLTF files
  return (
    <div ref={containerRef} className={className} style={style}>
      <model-viewer
        src={src}
        alt={alt}
        auto-rotate
        camera-controls
        style={{ width: '100%', height: '100%', backgroundColor: '#1a1a1a' }}
        loading="lazy"
        interaction-policy="allow-when-focused"
        ar
        ar-modes="webxr scene-viewer quick-look"
        shadow-intensity="1"
        exposure="1"
        onError={(e: any) => {
          console.error('3D Model loading error:', e)
        }}
      >
        <div slot="poster" style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontSize: '18px',
          fontWeight: 'bold'
        }}>
          Loading 3D Model...
        </div>
      </model-viewer>
    </div>
  )
}

