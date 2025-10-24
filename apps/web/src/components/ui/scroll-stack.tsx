'use client'

import { useEffect, useRef } from 'react'
import { 
  SiReact, 
  SiVuedotjs,
  SiAngular,
  SiNextdotjs, 
  SiNuxtdotjs,
  SiSvelte,
  SiTypescript, 
  SiJavascript, 
  SiHtml5,
  SiCss3,
  SiSass,
  SiTailwindcss, 
  SiNodedotjs, 
  SiExpress,
  SiPhp,
  SiLaravel,
  SiSharp,
  SiDotnet,
  SiSpring,
  SiRuby,
  SiPython, 
  SiDocker, 
  SiGit, 
  SiPostgresql, 
  SiMysql,
  SiMongodb, 
  SiRedis,
  SiAmazon,
  SiGooglecloud,
  SiSupabase,
  SiFirebase,
  SiVercel,
  SiNetlify,
  SiDigitalocean,
  SiHeroku,
  SiRailway,
  SiKubernetes,
  SiLinux,
  SiVim,
  SiOpenai,
  SiTensorflow,
  SiPytorch
} from 'react-icons/si'
import { 
  FaDatabase, 
  FaServer, 
  FaCode, 
  FaBrain, 
  FaRobot, 
  FaJava,
  FaCloud,
  FaRocket,
  FaHandshake,
  FaLightbulb,
  FaHeadset,
  FaChartLine,
  FaTasks,
  FaUsers,
  FaChalkboardTeacher,
  FaCogs,
  FaWrench,
  FaTruck,
  FaBuilding
} from 'react-icons/fa'

interface SkillCategory {
  title: string
  skills: string[]
  color: string
}

interface ScrollStackProps {
  categories: SkillCategory[]
}

// Mapping af skills til ikoner
const skillIcons: Record<string, React.ReactElement> = {
  // Frontend Development
  'React': <SiReact className="text-blue-400" />,
  'Vue.js': <SiVuedotjs className="text-green-500" />,
  'Angular': <SiAngular className="text-red-500" />,
  'Next.js': <SiNextdotjs className="text-white" />,
  'Nuxt.js': <SiNuxtdotjs className="text-green-400" />,
  'Svelte': <SiSvelte className="text-orange-500" />,
  'TypeScript': <SiTypescript className="text-blue-500" />,
  'JavaScript': <SiJavascript className="text-yellow-400" />,
  'HTML5': <SiHtml5 className="text-orange-500" />,
  'CSS3': <SiCss3 className="text-blue-500" />,
  'Sass': <SiSass className="text-pink-400" />,
  'Tailwind CSS': <SiTailwindcss className="text-cyan-400" />,
  
  // Backend Development
  'Node.js': <SiNodedotjs className="text-green-500" />,
  'Express': <SiExpress className="text-gray-400" />,
  'PHP': <SiPhp className="text-purple-500" />,
  'Laravel': <SiLaravel className="text-red-500" />,
  'C#': <SiSharp className="text-purple-600" />,
  '.NET': <SiDotnet className="text-purple-500" />,
  'Java (Spring)': <FaJava className="text-orange-600" />,
  'Ruby': <SiRuby className="text-red-500" />,
  'Python': <SiPython className="text-yellow-400" />,
  
  // Database & Storage
  'PostgreSQL': <SiPostgresql className="text-blue-500" />,
  'MySQL': <SiMysql className="text-blue-600" />,
  'MongoDB': <SiMongodb className="text-green-500" />,
  'Firebase': <SiFirebase className="text-yellow-500" />,
  'Redis': <SiRedis className="text-red-500" />,
  
  // Cloud & Infrastructure
  'AWS': <SiAmazon className="text-orange-400" />,
  'Google Cloud': <SiGooglecloud className="text-blue-400" />,
  'Azure': <FaCloud className="text-blue-500" />,
  'Supabase': <SiSupabase className="text-green-500" />,
  'Vercel': <SiVercel className="text-white" />,
  'Netlify': <SiNetlify className="text-cyan-400" />,
  'DigitalOcean': <SiDigitalocean className="text-blue-500" />,
  'Heroku': <SiHeroku className="text-purple-500" />,
  'Railway': <SiRailway className="text-white" />,
  
  // DevOps & Tools
  'Docker': <SiDocker className="text-blue-400" />,
  'Git': <SiGit className="text-orange-500" />,
  'Kubernetes': <SiKubernetes className="text-blue-600" />,
  'Linux': <SiLinux className="text-yellow-400" />,
  'Vim': <SiVim className="text-green-400" />,
  
  // AI/ML Skills
  'n8n': <FaRobot className="text-purple-400" />,
  'RAG': <FaBrain className="text-cyan-400" />,
  'LangChain': <FaCode className="text-green-400" />,
  'OpenAI API': <SiOpenai className="text-green-500" />,
  'Anthropic Claude': <FaBrain className="text-orange-400" />,
  'Vector Databases': <FaDatabase className="text-purple-500" />,
  'Embeddings': <FaBrain className="text-blue-400" />,
  'Prompt Engineering': <FaCode className="text-yellow-400" />,
  'Fine-tuning': <FaRobot className="text-red-400" />,
  'TensorFlow': <SiTensorflow className="text-orange-500" />,
  'PyTorch': <SiPytorch className="text-red-500" />,
  'Hugging Face': <FaRobot className="text-yellow-500" />,
  
  // General fallbacks
  'SQL': <FaDatabase className="text-blue-400" />,
  'REST APIs': <FaServer className="text-purple-400" />,
  'GraphQL': <FaCode className="text-pink-400" />,
  
  // Business & Consulting Skills
  'Digital Transformation': <FaRocket className="text-branding-500" />,
  'Technical Sales': <FaHandshake className="text-green-500" />,
  'IT Consulting': <FaLightbulb className="text-yellow-400" />,
  'Customer Support': <FaHeadset className="text-blue-500" />,
  'Product Strategy': <FaChartLine className="text-purple-500" />,
  'Project Management': <FaTasks className="text-orange-500" />,
  'Client Relations': <FaUsers className="text-cyan-400" />,
  'Technical Training': <FaChalkboardTeacher className="text-green-400" />,
  'System Integration': <FaCogs className="text-gray-400" />,
  'Troubleshooting': <FaWrench className="text-red-400" />,
  'Service Delivery': <FaTruck className="text-blue-600" />,
  'Solution Architecture': <FaBuilding className="text-purple-600" />
}

export default function ScrollStack({ categories }: ScrollStackProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const cards = container.querySelectorAll('.skill-card')
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect()
        const centerY = window.innerHeight / 2
        const distance = Math.abs(rect.top + rect.height / 2 - centerY)
        const maxDistance = window.innerHeight / 2
        const scale = Math.max(0.8, 1 - (distance / maxDistance) * 0.2)
        const opacity = Math.max(0.3, 1 - (distance / maxDistance) * 0.7)
        
        ;(card as HTMLElement).style.transform = `scale(${scale})`
        ;(card as HTMLElement).style.opacity = opacity.toString()
      })
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial call

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <div className="space-y-8">
        {categories.map((category, index) => (
          <div
            key={category.title}
            className="skill-card transition-all duration-500 ease-out"
            style={{ 
              position: 'sticky',
              top: `${80 + index * 20}px`,
              zIndex: categories.length - index
            }}
          >
            <div className={`relative overflow-hidden rounded-2xl p-8 shadow-2xl ${category.color}`}>
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-pulse"></div>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-6 tracking-wide">
                  {category.title}
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {category.skills.map((skill, skillIndex) => (
                    <div
                      key={skill}
                      className="group relative"
                      style={{ 
                        animationDelay: `${skillIndex * 100}ms`,
                        animation: 'fade-in 0.6s ease-out forwards'
                      }}
                    >
                      <div className="skill-card-content backdrop-blur-sm rounded-lg p-4 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
                        <div className="flex flex-col items-center space-y-2">
                          {/* Icon */}
                          <div className="text-3xl">
                            {skillIcons[skill] || <FaCode className="skill-text" />}
                          </div>
                          {/* Text underneath */}
                          <div className="skill-text font-medium text-xs text-center leading-tight">
                            {skill}
                          </div>
                        </div>
                      </div>
                      
                      {/* Hover glow effect */}
                      <div className="absolute inset-0 rounded-lg skill-hover-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}