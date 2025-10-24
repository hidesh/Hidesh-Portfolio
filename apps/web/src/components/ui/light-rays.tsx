'use client'

interface LightRaysProps {
  raysOrigin?: string
  raysColor?: string
  raysSpeed?: number
  lightSpread?: number
  rayLength?: number
  followMouse?: boolean
  mouseInfluence?: number
  noiseAmount?: number
  distortion?: number
}

export default function LightRays({
  raysOrigin = "top-center",
  raysColor = "#ffffff"
}: LightRaysProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(ellipse at ${raysOrigin === 'top-center' ? 'center top' : 'center'}, 
            ${raysColor}10 0%, 
            transparent 70%)`
        }}
      />
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: `conic-gradient(from 0deg at ${raysOrigin === 'top-center' ? 'center top' : 'center'}, 
            transparent 0deg, 
            ${raysColor}20 45deg, 
            transparent 90deg, 
            ${raysColor}15 135deg, 
            transparent 180deg, 
            ${raysColor}25 225deg, 
            transparent 270deg, 
            ${raysColor}20 315deg, 
            transparent 360deg)`
        }}
      />
    </div>
  )
}
