'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface ChristmasContextType {
  isChristmasMode: boolean
  toggleChristmasMode: () => void
}

const ChristmasContext = createContext<ChristmasContextType | undefined>(undefined)

export function ChristmasProvider({ children }: { children: React.ReactNode }) {
  const [isChristmasMode, setIsChristmasMode] = useState(false)

  // Load saved preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('christmasMode')
    if (saved === 'true') {
      setIsChristmasMode(true)
      applyChristmasTheme()
    }
  }, [])

  const applyChristmasTheme = () => {
    document.documentElement.classList.add('christmas-mode')
  }

  const removeChristmasTheme = () => {
    document.documentElement.classList.remove('christmas-mode')
  }

  const toggleChristmasMode = () => {
    setIsChristmasMode(prev => {
      const newValue = !prev
      localStorage.setItem('christmasMode', String(newValue))
      
      if (newValue) {
        applyChristmasTheme()
      } else {
        removeChristmasTheme()
      }
      
      return newValue
    })
  }

  return (
    <ChristmasContext.Provider value={{ isChristmasMode, toggleChristmasMode }}>
      {children}
    </ChristmasContext.Provider>
  )
}

export function useChristmas() {
  const context = useContext(ChristmasContext)
  if (context === undefined) {
    throw new Error('useChristmas must be used within a ChristmasProvider')
  }
  return context
}
