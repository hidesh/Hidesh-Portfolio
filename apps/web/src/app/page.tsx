import React from 'react'
import Image from 'next/image'
import ScrollStack from '@/components/ui/scroll-stack-clean'
import { CareerPath } from '@/components/ui/career-path'
import ThemeBackground from '@/components/ui/theme-background'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import Orb from '@/components/ui/orb'
import { Github, ExternalLink, Mail, Linkedin, ChevronDown } from 'lucide-react'
import type { Metadata } from 'next'
import { siteConfig, getOpenGraphMetadata, getTwitterMetadata } from '@/lib/seo'

interface Project {
  id: string
  title: string
  summary: string
  tags: string[]
  cover_image: string | null
  live_url: string | null
  repo_url: string | null
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: siteConfig.title,
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.author, url: siteConfig.url }],
    openGraph: getOpenGraphMetadata({
      title: siteConfig.title,
      description: siteConfig.description,
    }),
    twitter: getTwitterMetadata({
      title: siteConfig.title,
      description: siteConfig.description,
    }),
    alternates: {
      canonical: siteConfig.url,
    },
  }
}

export default function Home() {
  // Real projects - GitHub and live projects
  const projects = [
    {
      id: '1',
      title: 'Automate Carwash',
      summary: 'Progressive Web App for digitizing car wash operations. Features dynamic pricing algorithm with API integration (license plate, size, weight), online booking, customer login, real-time status, Firebase Cloud Messaging notifications, and Google Cloud Storage for images. Built with React, Node.js/Express, Supabase (PostgreSQL). Mobile-first PWA that reduces manual errors and increases revenue through automation.',
      tags: ['React', 'Node.js', 'Express', 'Supabase', 'PostgreSQL', 'Firebase', 'Google Cloud', 'PWA'],
      cover_image: null,
      live_url: 'https://auto-carwash-code.vercel.app',
      repo_url: null
    },
    {
      id: '2', 
      title: 'SQL Agent - Support Solutions',
      summary: 'AI-powered SQL agent system for automated support solutions with intelligent query generation and data analysis.',
      tags: ['AI', 'SQL', 'Python', 'Machine Learning', 'Automation'],
      cover_image: null,
      live_url: null,
      repo_url: 'https://github.com/hidesh/sql-agent---Support-Solutions'
    },
    {
      id: '3',
      title: 'Support Solutions RAG', 
      summary: 'Retrieval-Augmented Generation system for intelligent support documentation and knowledge base management.',
      tags: ['RAG', 'AI', 'LangChain', 'Vector Database', 'NLP'],
      cover_image: null,
      live_url: null,
      repo_url: 'https://github.com/hidesh/supportsolutions-rag'
    },
    {
      id: '4',
      title: 'Newsletter Automation',
      summary: 'Automated newsletter system with intelligent content generation, scheduling, and distribution capabilities.',
      tags: ['Automation', 'Node.js', 'Email Marketing', 'Scheduling', 'API Integration'],
      cover_image: null,
      live_url: null,
      repo_url: 'https://github.com/hidesh/Newsletter-Automation'
    }
  ]

  // Mock skills data til vi får en rigtig getSkills funktion
  const skillCategories = [
    {
      title: 'Frontend Development',
      color: 'bg-gradient-to-br from-branding-500 to-branding-700',
      skills: [
        'React', 'Vue.js', 'Angular', 'Next.js', 'Nuxt.js', 'Svelte',
        'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Sass', 'Tailwind CSS'
      ]
    },
    {
      title: 'Backend Development', 
      color: 'bg-gradient-to-br from-primary-600 to-primary-800',
      skills: [
        'Node.js', 'Express', 'PHP', 'Laravel', 'C#', '.NET',
        'Java (Spring)', 'Ruby', 'Python'
      ]
    },
    {
      title: 'AI & Machine Learning',
      color: 'bg-gradient-to-br from-purple-600 to-purple-800',
      skills: [
        'n8n', 'RAG', 'LangChain', 'OpenAI API', 'Anthropic Claude',
        'Vector Databases', 'Embeddings', 'Prompt Engineering', 'Fine-tuning',
        'TensorFlow', 'PyTorch', 'Hugging Face'
      ]
    },
    {
      title: 'Cloud & Infrastructure',
      color: 'bg-gradient-to-br from-blue-600 to-blue-800',
      skills: [
        'AWS', 'Google Cloud', 'Azure', 'Supabase', 'Firebase',
        'Vercel', 'Netlify', 'DigitalOcean', 'Heroku', 'Railway'
      ]
    },
    {
      title: 'Database & Storage',
      color: 'bg-gradient-to-br from-mid-gray to-dark-gray',
      skills: [
        'PostgreSQL', 'MySQL', 'MongoDB', 'Firebase', 'Redis'
      ]
    },
    {
      title: 'Business & Consulting',
      color: 'bg-gradient-to-br from-branding-500 to-branding-700',
      skills: [
        'Digital Transformation', 'Technical Sales', 'IT Consulting', 
        'Customer Support', 'Product Strategy', 'Project Management',
        'Client Relations', 'Technical Training', 'System Integration',
        'Troubleshooting', 'Service Delivery', 'Solution Architecture'
      ]
    }
  ]

  // Education timeline data
  const educationTimeline = [
    {
      id: 1,
      type: 'education' as const,
      title: 'Bachelor in Web Development (PBA)',
      company: 'Zealand Academy of Technologies and Business',
      period: 'September 2023 - January 2025',
      description: [
        'Specialization in modern web development with focus on React and Next.js',
        'Advanced frontend development and user experience design',
        'Full-stack projects with backend service integration',
        'Agile development and team collaboration'
      ]
    },
    {
      id: 2,
      type: 'education' as const,
      title: 'AP in Multimedia Design and Communication',
      company: 'Zealand Academy of Technologies and Business',
      period: 'September 2021 - June 2023',
      description: [
        'Fundamental competencies in web development and design',
        'UX/UI design and user-centered development',
        'Frontend technologies: HTML, CSS, JavaScript',
        'Project management and creative problem solving'
      ]
    }
  ]

  // Work experience timeline data
  const workTimeline = [
    {
      id: 1,
      type: 'work' as const,
      title: 'Full-stack Developer Intern',
      company: 'Copenhagen Diamond Group A/S',
      period: 'August 2024 - October 2024',
      description: [
        'Developed responsive frontend in Next.js with dynamic admin dashboard and product catalog',
        'Created backend logic in Node.js and Express for handling REST APIs and real-time updates',
        'Implemented real-time synchronization with Firebase and Google Cloud for secure file handling',
        'Improved performance and maintainability by optimizing data flow between frontend and backend',
        'Designed entire UI and user journey in Figma, including a functional prototype'
      ]
    },
    {
      id: 2,
      type: 'work' as const,
      title: 'Technical Sales & Support Specialist - Computer/IT Department',
      company: 'Power A/S',
      period: 'September 2023 - Present',
      description: [
        'Advising customers on IT and electronics by combining sales skills with technical knowledge',
        'Performing complete setup of devices such as laptops, phones, and tablets',
        'Providing support to customers and colleagues with hardware and software troubleshooting',
        'Communicating solutions clearly and understandably to a diverse customer base'
      ]
    },
    {
      id: 3,
      type: 'work' as const,
      title: 'IT Supporter | Student Assistant',
      company: 'Welcomebob A/S',
      period: 'September 2023 - December 2023',
      description: [
        'Responsible for troubleshooting and monitoring of door entry systems, both on-site and via online platforms',
        'Provided technical support and customer service over the phone, focusing on clear communication and fast issue resolution',
        'Installed and repaired intercom systems in residential buildings with a focus on reliability and a positive service experience'
      ]
    },
    {
      id: 4,
      type: 'work' as const,
      title: 'Frontend Developer Intern',
      company: 'Dreamplan.io (Fintech)',
      period: 'January 2023 - March 2023',
      description: [
        'Developed responsive UI components in Next.js and Tailwind with focus on user-friendliness',
        'Integrated dynamic data and API endpoints for visualization of live statistics',
        'Worked in agile team with scrum, standups, and continuous improvements',
        'Contributed to Git-flow and deployment processes'
      ]
    },
    {
      id: 5,
      type: 'work' as const,
      title: 'Student Assistant',
      company: 'Zealand Academy of Technologies and Business',
      period: 'August 2022 - June 2023',
      description: [
        'Provided individual guidance to students in development and programming projects',
        'Assisted with Adobe Creative Cloud (including Premiere Pro and Photoshop) for design and media projects',
        'Responsible for the media department with photo, video and 3D-print, from technical setup to guidance'
      ]
    },
    {
      id: 6,
      type: 'work' as const,
      title: 'Member & Participant – Girls in IT Zealand',
      company: 'Volunteer Work',
      period: 'September 2023 - Present',
      description: [
        'Participating in student initiative working to create more visibility and space for women in IT',
        'Contributing with help for workshops, design and development of the website (Vue.js)',
        'Working for diversity and for more women to be represented in the IT industry',
        'Helping to ensure an inclusive community'
      ]
    }
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-background/95 text-foreground">
      {/* Hero Section */}
      <section id="home" className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-32">
        <ErrorBoundary fallback={<div className="fixed inset-0 bg-background/50 pointer-events-none z-0" />}>
          <ThemeBackground />
        </ErrorBoundary>
        <div className="container mx-auto text-center relative z-20">
          {/* Profile Image with 3D Orb Ring */}
          <div className="mb-12 flex justify-center">
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              {/* 3D Orb Ring - Full Container */}
              <div className="absolute inset-0">
                <ErrorBoundary fallback={
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-branding-500 via-branding-600 to-branding-800 opacity-20"></div>
                }>
                  <Orb
                    hue={200}
                    hoverIntensity={2.5}
                    rotateOnHover={false}
                    forceHoverState={false}
                  />
                </ErrorBoundary>
              </div>
              
              {/* Profile Image Centered on Top */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="relative w-40 h-40 md:w-52 md:h-52">
                  <div className="h-full w-full rounded-full overflow-hidden ring-4 ring-background shadow-2xl">
                    <ErrorBoundary fallback={<div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-2xl font-bold">HK</div>}>
                      <Image
                        src="/Hidesh-profile.png"
                        alt="Hidesh Kumar - Software Engineer"
                        width={208}
                        height={208}
                        priority
                        className="w-full h-full object-cover"
                        sizes="(max-width: 768px) 160px, 208px"
                        quality={90}
                      />
                    </ErrorBoundary>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-fade-in">
            <span className="text-foreground">Hi, I&apos;m </span>
            <span className="text-gradient">Hidesh</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in">
            Software Engineer passionate about building exceptional digital experiences 
            with modern technologies
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fade-in">
            <a
              href="#contact"
              className="btn-primary px-8 py-4 bg-gradient-to-r from-branding-600 to-branding-800 hover:from-branding-500 hover:to-branding-700 text-white font-semibold rounded-xl transition-all duration-300 glow-hover"
            >
              Get In Touch
            </a>
            <a
              href="#projects"
              className="px-8 py-4 border-2 border-branding-500 text-branding-600 hover:bg-branding-500 hover:text-white font-semibold rounded-xl transition-all duration-300"
            >
              View Projects
            </a>
          </div>

          <div className="flex justify-center space-x-6 mb-16">
            <a
              href="https://github.com/hidesh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-branding-600 transition-colors duration-200 p-3 rounded-full hover:bg-branding-500/10"
              aria-label="GitHub"
            >
              <Github className="h-6 w-6" />
            </a>
            <a
              href="https://linkedin.com/in/hidesh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-branding-600 transition-colors duration-200 p-3 rounded-full hover:bg-branding-500/10"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-6 w-6" />
            </a>
            <a
              href="mailto:hidesh@live.dk"
              className="text-muted-foreground hover:text-branding-600 transition-colors duration-200 p-3 rounded-full hover:bg-branding-500/10"
              aria-label="Email"
            >
              <Mail className="h-6 w-6" />
            </a>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section id="about" className="relative z-10 py-20 px-6 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gradient">
            About Me
          </h2>
          
          <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed">
            <p className="text-xl mb-6">
              As a software engineer with a focus on innovation and efficiency, I have dedicated my career to 
              creating digital solutions that transform businesses and improve user experiences. My approach to 
              development is driven by a deep understanding of both technical possibilities and business needs.
            </p>
            
            <p className="text-lg mb-6">
              My professional experience spans broadly across <span className="text-branding-500 font-semibold">digital transformation</span>, 
              where I have helped companies modernize their technological infrastructure and optimize their workflows. 
              Through work with <span className="text-branding-500 font-semibold">AI development for sales and consulting</span>, I have 
              specialized in building intelligent systems that automate processes and create value for customers.
            </p>

            <p className="text-lg mb-6">
              As a <span className="text-branding-500 font-semibold">technical consultant</span>, I focus on delivering 
              strategic solutions that match companies' long-term goals. My experience with 
              <span className="text-branding-500 font-semibold"> IT support and customer service</span> has taught me the importance 
              of simplifying complex technical concepts and delivering exceptional customer guidance throughout the implementation process.
            </p>

            <p className="text-lg mb-6">
              Beyond my technical career, I have a passion for <span className="text-branding-500 font-semibold">music production</span>, 
              which gives me a creative outlet and a unique perspective on problem-solving. This combination of technical expertise 
              and creative thinking helps me approach development tasks from innovative angles and create solutions that are both 
              functional and aesthetically appealing.
            </p>

            <p className="text-lg">
              My development process is characterized by thorough planning, iterative design, and close collaboration with clients 
              to ensure that the final product not only meets but exceeds expectations. I believe that technology 
              is most powerful when it makes life easier for those who use it.
            </p>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="relative z-10 py-20 px-6">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gradient">
            Education
          </h2>
          <CareerPath items={educationTimeline} />
        </div>
      </section>

      {/* Work Experience Section */}
      <section id="experience" className="relative z-10 py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gradient">
            Work Experience
          </h2>
          <CareerPath items={workTimeline} />
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="relative z-10 py-20 px-6">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gradient">
            Featured Projects
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {projects?.map((project) => (
              <div
                key={project.id}
                className="project-card group bg-muted/50 backdrop-blur-md rounded-xl border border-branding-200 dark:border-branding-800 p-6 hover:border-branding-400 transition-all duration-300 flex flex-col h-full"
              >
                {project.cover_image && (
                  <div className="mb-4 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={project.cover_image}
                      alt={project.title}
                      className="project-image w-full h-48 object-cover"
                    />
                  </div>
                )}
                
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-branding-600 transition-colors flex-shrink-0">
                  {project.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed flex-grow line-clamp-4">
                  {project.summary}
                </p>
                
                {project.tags && (
                  <div className="flex flex-wrap gap-2 mb-4 flex-shrink-0">
                    {project.tags.map((tech: string) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-xs font-medium bg-branding-500/20 text-branding-600 dark:text-branding-400 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex space-x-4 flex-shrink-0 mt-auto">
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-branding-600 hover:text-branding-700 transition-colors"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  )}
                  {project.repo_url && (
                    <a
                      href={project.repo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-branding-600 hover:text-branding-700 transition-colors"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="relative z-10 py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gradient">
            Skills & Technologies
          </h2>
          <ErrorBoundary fallback={
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-muted/50 rounded-xl p-6 animate-pulse">
                    <div className="h-6 bg-muted rounded mb-4"></div>
                    <div className="space-y-2">
                      {[...Array(4)].map((_, j) => (
                        <div key={j} className="h-4 bg-muted rounded w-3/4"></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          }>
            <ScrollStack categories={skillCategories} />
          </ErrorBoundary>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 py-20 px-6">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gradient">
            Let&apos;s Connect
          </h2>
          
          <p className="text-muted-foreground text-lg mb-12 leading-relaxed">
            I&apos;m always interested in hearing about new opportunities and exciting projects.
            Let&apos;s build something amazing together!
          </p>
          
          <div className="space-y-6">
            <a
              href="mailto:hidesh@live.dk"
              className="btn-primary inline-flex items-center px-8 py-4 bg-gradient-to-r from-branding-600 to-branding-800 hover:from-branding-500 hover:to-branding-700 text-white font-semibold rounded-xl transition-all duration-300 glow-hover"
            >
              <Mail className="h-5 w-5 mr-2" />
              Send me an email
            </a>
            
            <div className="flex justify-center space-x-6">
              <a
                href="https://github.com/hidesh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-branding-600 transition-colors duration-200 p-4 rounded-full hover:bg-branding-500/10"
                aria-label="GitHub"
              >
                <Github className="h-8 w-8" />
              </a>
              <a
                href="https://linkedin.com/in/hidesh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-branding-600 transition-colors duration-200 p-4 rounded-full hover:bg-branding-500/10"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-8 w-8" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}