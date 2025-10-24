'use client'

import LightRaysFallback from './light-rays-fallback'

export default function ThemeBackground() {
  return (
    <LightRaysFallback 
      raysOrigin="top-center"
      raysColor="#E85002"
      raysSpeed={1.0}
      lightSpread={1.5}
      rayLength={1.5}
      followMouse={false}
      mouseInfluence={0}
      noiseAmount={0.03}
      distortion={0.01}
    />
  )
}