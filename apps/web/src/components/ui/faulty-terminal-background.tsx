'use client'

import { useEffect, useRef, useState } from 'react'

export default function FaultyTerminalBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Configuration
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
    const fontSize = 16
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = []
    const glitchLines: Array<{ y: number, opacity: number, duration: number }> = []

    // Initialize drops
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * canvas.height
    }

    let time = 0
    const glitchIntensity = 0.03

    const draw = () => {
      time += 0.016

      // Darker background for better contrast
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Set font
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = chars[Math.floor(Math.random() * chars.length)]
        
        // Calculate distance from mouse for reactive effect
        const columnX = i * fontSize
        const charY = drops[i] * fontSize
        const mouseDistance = Math.sqrt(
          Math.pow(columnX - mousePos.x, 2) + Math.pow(charY - mousePos.y, 2)
        )
        const mouseEffect = Math.max(0, 1 - mouseDistance / 200) * 0.8
        
        // Enhanced brightness and opacity
        const baseOpacity = 0.9 + mouseEffect
        const flickerOpacity = baseOpacity + Math.sin(time * 12 + i) * 0.3
        const finalOpacity = Math.min(1, Math.max(0.2, flickerOpacity))
        
        // Brighter orange with green accent for variety
        const isSpecial = Math.random() < 0.1
        const color = isSpecial 
          ? `rgba(0, 255, 65, ${finalOpacity})` // Bright green accent
          : `rgba(255, 140, 30, ${finalOpacity})` // Brighter orange
        
        ctx.fillStyle = color
        
        // Enhanced glitch effect
        const glitchOffset = Math.sin(time * 8 + i * 0.7) * glitchIntensity * fontSize
        const x = columnX + glitchOffset + (mouseEffect * Math.sin(time * 5) * 3)
        const y = charY

        // Add glow effect for characters near mouse
        if (mouseEffect > 0.3) {
          ctx.shadowColor = isSpecial ? '#00ff41' : '#ff8c1e'
          ctx.shadowBlur = 10 + mouseEffect * 15
        } else {
          ctx.shadowBlur = 0
        }

        ctx.fillText(char, x, y)

        // Reset shadow
        ctx.shadowBlur = 0

        // Random reset with mouse influence
        const resetChance = mouseEffect > 0.5 ? 0.98 : 0.975
        if (drops[i] * fontSize > canvas.height && Math.random() > resetChance) {
          drops[i] = 0
        }

        drops[i] += 0.5 + mouseEffect * 0.5

        // More frequent horizontal glitch lines
        if (Math.random() < 0.003 + mouseEffect * 0.002) {
          glitchLines.push({
            y: y,
            opacity: 0.4 + mouseEffect * 0.4,
            duration: 10 + Math.random() * 20
          })
        }
      }

      // Draw and update glitch lines
      glitchLines.forEach((line, index) => {
        ctx.fillStyle = `rgba(255, 140, 30, ${line.opacity})`
        ctx.fillRect(0, line.y, canvas.width, 2)
        
        // Add scanline effect
        ctx.fillStyle = `rgba(0, 255, 65, ${line.opacity * 0.3})`
        ctx.fillRect(0, line.y + 1, canvas.width, 1)
        
        line.duration--
        line.opacity *= 0.95
        
        if (line.duration <= 0) {
          glitchLines.splice(index, 1)
        }
      })

      // Screen flicker effect
      if (Math.random() < 0.02) {
        ctx.fillStyle = `rgba(255, 140, 30, ${0.05 + Math.random() * 0.1})`
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [mousePos.x, mousePos.y])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-70"
    />
  )
}