'use client'

import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 bg-gradient-to-b from-background to-background/80">
      <div className="mx-auto max-w-md text-center space-y-8">
        {/* 404 Animation */}
        <div className="relative">
          <h1 className="text-[10rem] font-bold bg-gradient-to-br from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
            404
          </h1>
          <div className="absolute inset-0 blur-3xl bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20 -z-10" />
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">
            Page Not Found
          </h2>
          <p className="text-muted-foreground text-lg">
            Oops! The page you're looking for seems to have wandered off into the digital void.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            href="/"
            className="group inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:scale-105"
          >
            <Home className="h-4 w-4 group-hover:rotate-12 transition-transform" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="group inline-flex items-center justify-center gap-2 rounded-lg border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all hover:scale-105"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="pt-8 text-xs text-muted-foreground">
          <p>Error Code: 404 | Page Not Found</p>
        </div>
      </div>
    </div>
  )
}
