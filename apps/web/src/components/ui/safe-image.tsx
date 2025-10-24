'use client'

import { useState } from 'react'
import NextImage from 'next/image'

interface SafeImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
}

export default function SafeImage({ 
  src, 
  alt, 
  width, 
  height, 
  className, 
  priority, 
  fill, 
  sizes 
}: SafeImageProps) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div className={`bg-muted flex items-center justify-center ${className}`}>
        <span className="text-muted-foreground text-sm">{alt}</span>
      </div>
    )
  }

  return (
    <NextImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      fill={fill}
      sizes={sizes}
      onError={() => setError(true)}
    />
  )
}