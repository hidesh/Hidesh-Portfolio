'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../theme-provider'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-branding-200 dark:border-branding-800 bg-muted backdrop-blur-sm transition-all duration-300 hover:border-branding-400 hover:bg-branding-50 dark:hover:bg-branding-900/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-branding-400"
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-branding-600" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-branding-600" />
    </button>
  )
}