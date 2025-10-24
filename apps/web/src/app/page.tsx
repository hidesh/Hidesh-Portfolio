import { Suspense } from 'react'
import ScrollStack from '@/components/ui/scroll-stack'
import ThemeBackground from '@/components/ui/theme-background'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import SafeImage from '@/components/ui/safe-image'
import { Github, ExternalLink, Mail, Linkedin, ChevronDown } from 'lucide-react'
import type { Metadata } from 'next'

interface Project {
  id: string
  title: string
  summary: string
  tags: string[]
  cover_image: string | null
  live_url: string | null
  repo_url: string | null
}

export const metadata: Metadata = {
  title: 'Hidesh Kumar - Software Engineer',
  description: 'Software Engineer passionate about building exceptional digital experiences with modern technologies. Specializing in React, Next.js, TypeScript, and cloud architecture.',
}

export default function Home() {
  // Hardcoded projects - no database needed
  const projects = [
    {
      id: '1',
      title: 'AI Chat Assistant',
      summary: 'Intelligent chat assistant powered by OpenAI GPT-4 with real-time responses and context awareness.',
      tags: ['React', 'Next.js', 'OpenAI', 'TypeScript', 'Tailwind CSS'],
      cover_image: null,
      live_url: 'https://chat-demo.hidesh.com',
      repo_url: 'https://github.com/hidesh/ai-chat-assistant'
    },
    {
      id: '2', 
      title: 'E-commerce Platform',
      summary: 'Full-stack e-commerce solution with payment integration, inventory management, and admin dashboard.',
      tags: ['Next.js', 'Supabase', 'Stripe', 'PostgreSQL', 'Tailwind CSS'],
      cover_image: null,
      live_url: 'https://shop-demo.hidesh.com',
      repo_url: 'https://github.com/hidesh/ecommerce-platform'
    },
    {
      id: '3',
      title: 'Task Management App', 
      summary: 'Collaborative project management tool with real-time updates, team collaboration, and analytics.',
      tags: ['React', 'Firebase', 'Material-UI', 'Node.js', 'Express'],
      cover_image: null,
      live_url: 'https://tasks-demo.hidesh.com',
      repo_url: 'https://github.com/hidesh/task-manager'
    },
    {
      id: '4',
      title: 'Portfolio Website',
      summary: 'Modern portfolio website with CMS integration, blog functionality, and analytics dashboard.',
      tags: ['Next.js', 'Supabase', 'TypeScript', 'Tailwind CSS', 'Vercel'],
      cover_image: null,
      live_url: 'https://hidesh.com',
      repo_url: 'https://github.com/hidesh/portfolio'
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

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Hero Section */}
      <section id="home" className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-32">
        <ErrorBoundary fallback={<div className="fixed inset-0 bg-gradient-to-br from-orange-50/10 to-transparent pointer-events-none z-0" />}>
          <Suspense fallback={<div className="fixed inset-0 bg-gradient-to-br from-orange-50/10 to-transparent pointer-events-none z-0" />}>
            <ThemeBackground />
          </Suspense>
        </ErrorBoundary>
        <div className="container mx-auto text-center relative z-20">
          {/* Profile Image */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="h-32 w-32 md:h-40 md:w-40 rounded-full bg-gradient-to-br from-branding-500 via-branding-600 to-branding-800 p-1 animate-pulse-slow">
                <div className="h-full w-full rounded-full overflow-hidden">
                  <ErrorBoundary fallback={<div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">HK</div>}>
                    <SafeImage
                      src="/Hidesh-profile.png"
                      alt="Hidesh Kumar"
                      width={160}
                      height={160}
                      className="w-full h-full object-cover"
                      priority
                    />
                  </ErrorBoundary>
                </div>
              </div>
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-branding-500 via-branding-600 to-branding-800 opacity-30 blur-lg animate-pulse-slow"></div>
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

          <div className="animate-bounce">
            <ChevronDown className="h-8 w-8 text-branding-600 mx-auto" />
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

      {/* Projects Section */}
      <section id="projects" className="relative z-10 py-20 px-6">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gradient">
            Featured Projects
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {projects?.map((project) => (
              <div
                key={project.id}
                className="project-card group bg-muted/50 backdrop-blur-md rounded-xl border border-branding-200 dark:border-branding-800 p-6 hover:border-branding-400 transition-all duration-300"
              >
                {project.cover_image && (
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <img
                      src={project.cover_image}
                      alt={project.title}
                      className="project-image w-full h-48 object-cover"
                    />
                  </div>
                )}
                
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-branding-600 transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {project.summary}
                </p>
                
                {project.tags && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tech: string) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-xs font-medium bg-branding-500/20 text-branding-600 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex space-x-4">
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
          <ErrorBoundary fallback={<div className="text-center text-muted-foreground">Loading skills...</div>}>
            <Suspense fallback={<div className="text-center text-muted-foreground">Loading skills...</div>}>
              <ScrollStack categories={skillCategories} />
            </Suspense>
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