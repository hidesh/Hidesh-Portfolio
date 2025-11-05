'use client'

import React from 'react'
import { useChristmas } from './christmas-provider'

export function ChristmasVideoBackground() {
  const { isChristmasMode } = useChristmas()

  if (!isChristmasMode) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover opacity-30"
        style={{
          mixBlendMode: 'screen',
        }}
      >
        <source src="https://raqtsjbnxhd2d05h.public.blob.vercel-storage.com/christmas-video.mp4" type="video/mp4" />
      </video>
      {/* Overlay for bedre læsbarhed */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
    </div>
  )
}
