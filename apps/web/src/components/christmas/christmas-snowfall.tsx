'use client'

import React from 'react'
import Snowfall from 'react-snowfall'
import { useChristmas } from './christmas-provider'

export function ChristmasSnowfall() {
  const { isChristmasMode } = useChristmas()

  if (!isChristmasMode) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <Snowfall
        color="rgba(255, 255, 255, 0.6)"
        snowflakeCount={150}
        speed={[0.5, 1.5]}
        wind={[-0.5, 1.0]}
        radius={[0.5, 3.0]}
      />
    </div>
  )
}
