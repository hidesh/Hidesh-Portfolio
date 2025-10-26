'use client'

import { useEffect, useRef, useState } from 'react'

interface TimelineItem {
  id: number
  type: 'education' | 'work'
  title: string
  company: string
  location?: string
  period: string
  description: string[]
}

interface CareerPathProps {
  items: TimelineItem[]
}

export function CareerPath({ items }: CareerPathProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

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

    const items = timelineRef.current?.querySelectorAll('.timeline-item')
    items?.forEach((item) => observer.observe(item))

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={timelineRef} className="relative max-w-5xl mx-auto">
      {/* Timeline Line */}
      <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-branding-500 via-branding-600 to-branding-800 transform md:-translate-x-1/2" />

      <div className="space-y-12">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`timeline-item relative opacity-0 ${
              index % 2 === 0 ? 'md:pr-1/2 md:text-right' : 'md:pl-1/2 md:ml-auto'
            }`}
            style={{ animationDelay: `${index * 150}ms` }}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {/* Timeline Dot */}
            <div
              className={`absolute left-8 md:left-1/2 top-0 transform md:-translate-x-1/2 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                activeIndex === index
                  ? 'bg-gradient-to-br from-branding-500 to-branding-800 scale-110 shadow-xl shadow-branding-500/50'
                  : 'bg-gradient-to-br from-branding-600 to-branding-700'
              }`}
            >
              {item.type === 'education' ? (
                <span className="text-2xl">🎓</span>
              ) : (
                <span className="text-2xl">💼</span>
              )}
            </div>

            {/* Content Card */}
            <div
              className={`ml-28 md:ml-0 ${
                index % 2 === 0 ? 'md:mr-20' : 'md:ml-20'
              }`}
            >
              <div
                className={`bg-muted/50 backdrop-blur-md rounded-xl border border-branding-200 dark:border-branding-800 p-6 hover:border-branding-400 transition-all duration-300 ${
                  activeIndex === index ? 'shadow-xl shadow-branding-500/20 scale-105' : ''
                }`}
              >
                {/* Header */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-branding-600 font-semibold mb-1">
                    {item.company}
                  </p>
                  {item.location && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {item.location}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>📅</span>
                    <span>{item.period}</span>
                  </div>
                </div>

                {/* Description */}
                <ul className="space-y-2">
                  {item.description.map((desc, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-branding-500 mt-1">•</span>
                      <span>{desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}