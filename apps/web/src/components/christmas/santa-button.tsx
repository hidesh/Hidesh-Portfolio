'use client'

import React from 'react'
import { useChristmas } from './christmas-provider'

export function SantaButton() {
  const { toggleChristmasMode } = useChristmas()

  return (
    <button
      onClick={toggleChristmasMode}
      className="relative flex flex-row items-center gap-2 group hover:scale-105 transition-transform duration-300"
      aria-label="Toggle Christmas mode"
    >
      {/* Hover text and arrow pointing toward Santa */}
      <div className="flex flex-row items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-sm text-red-600 dark:text-red-400 whitespace-nowrap animate-pulse font-cursive">
          press me for a surprise
        </span>
        <svg
          className="w-6 h-6 text-red-500 animate-pulse"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </div>
      {/* Santa icon - visible at all times */}
      <span className="text-3xl animate-bounce">🎅</span>
    </button>
  )
}
