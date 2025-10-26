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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in')
          }
        })
      },
      { threshold: 0.1 }
    )

    const items = containerRef.current?.querySelectorAll('.skill-card')
    items?.forEach((item) => observer.observe(item))

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <div
            key={category.title}
            className="skill-card opacity-0 group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="bg-muted/50 backdrop-blur-md rounded-xl border border-branding-200 dark:border-branding-800 p-6 hover:border-branding-400 transition-all duration-300 hover:shadow-xl hover:shadow-branding-500/20 hover:scale-105">
              <div className={`${category.color} text-white rounded-lg p-4 mb-4`}>
                <h3 className="text-xl font-bold">{category.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-sm font-medium bg-branding-500/20 text-branding-600 dark:text-branding-400 rounded-full hover:bg-branding-500/30 transition-colors duration-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
