'use client'

import { useEffect, useRef } from 'react'

interface SkillCategory {
  title: string
  color: string
  skills: string[]
}

interface ScrollStackProps {
  categories: SkillCategory[]
}

export default function ScrollStack({ categories }: ScrollStackProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scrollSpeed = 1
    let animationId: number

    const scroll = () => {
      const scrollLeft = container.scrollLeft
      const maxScroll = container.scrollWidth - container.clientWidth

      if (scrollLeft >= maxScroll) {
        container.scrollLeft = 0
      } else {
        container.scrollLeft += scrollSpeed
      }

      animationId = requestAnimationFrame(scroll)
    }

    animationId = requestAnimationFrame(scroll)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div className="w-full overflow-hidden">
      <div
        ref={containerRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollBehavior: 'smooth' }}
      >
        {categories.map((category, categoryIndex) => (
          <div
            key={categoryIndex}
            className="flex-shrink-0 bg-card rounded-lg p-6 border border-border min-w-[300px]"
          >
            <h3 className="text-xl font-semibold mb-4 text-branding-600">
              {category.title}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {category.skills.map((skill, skillIndex) => (
                <div
                  key={skillIndex}
                  className="flex items-center gap-2 p-2 bg-muted/50 rounded-md hover:bg-muted transition-colors"
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-branding-500 to-branding-700 rounded flex items-center justify-center text-white text-xs font-bold">
                    {skill.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {/* Duplicate for seamless scroll */}
        {categories.map((category, categoryIndex) => (
          <div
            key={`duplicate-${categoryIndex}`}
            className="flex-shrink-0 bg-card rounded-lg p-6 border border-border min-w-[300px]"
          >
            <h3 className="text-xl font-semibold mb-4 text-branding-600">
              {category.title}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {category.skills.map((skill, skillIndex) => (
                <div
                  key={skillIndex}
                  className="flex items-center gap-2 p-2 bg-muted/50 rounded-md hover:bg-muted transition-colors"
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-branding-500 to-branding-700 rounded flex items-center justify-center text-white text-xs font-bold">
                    {skill.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}