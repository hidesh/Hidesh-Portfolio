import { getProfile, getFeaturedProjects } from '@/lib/supabase/queries'
import FaultyTerminalBackground from '@/components/ui/faulty-terminal-background'
import ScrollStack from '@/components/ui/scroll-stack'

const skillsData = [
  {
    title: 'Frontend Development',
    color: 'bg-gradient-to-br from-branding-500 to-branding-700',
    skills: [
      'React', 'Vue.js', 'Angular', 'Next.js', 'Nuxt.js', 'Svelte',
      'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Sass', 'Tailwind CSS',
      'Bootstrap', 'Bulma', 'React Native', 'Ionic'
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
    title: 'Database & Storage',
    color: 'bg-gradient-to-br from-mid-gray to-dark-gray',
    skills: [
      'PostgreSQL', 'MySQL', 'MariaDB', 'MongoDB', 'Firebase',
      'Redux', 'State Management'
    ]
  },
  {
    title: 'Cloud & DevOps',
    color: 'bg-gradient-to-br from-branding-400 to-branding-600',
    skills: [
      'AWS', 'Google Cloud Platform', 'Docker', 'Heroku',
      'Nginx', 'Git', 'Postman'
    ]
  },
  {
    title: 'AI & Emerging Tech',
    color: 'bg-gradient-to-br from-primary-700 to-primary-900',
    skills: [
      'TensorFlow', 'OpenCV', 'AI Integration', 'n8n Automation',
      'Arduino', 'IoT Development'
    ]
  },
  {
    title: 'Design & Tools',
    color: 'bg-gradient-to-br from-light-gray to-mid-gray',
    skills: [
      'Figma', 'Adobe Illustrator', 'Adobe Photoshop', 'Adobe XD',
      'Jest Testing', 'Babel'
    ]
  }
]

export default async function Home() {
  const profile = await getProfile()
  const projects = await getFeaturedProjects()

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      {/* Faulty Terminal Background */}
      <FaultyTerminalBackground />
      
      {/* Hero Section with Profile */}
            {/* Hero Section */}
            {/* About Section */}
            {/* Contact Section */}
      <section id="contact" className="relative z-10 py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Profile Image Placeholder */}
            <div className="relative group">
              <div className="w-80 h-80 rounded-full bg-gradient-to-br from-federal_blue-500 via-navy_blue-500 to-duke_blue-500 p-1 shadow-2xl">
                <div className="w-full h-full rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center overflow-hidden relative">
                  {/* Placeholder Avatar */}
                  <div className="text-8xl font-bold text-transparent bg-gradient-to-br from-federal_blue-300 to-duke_blue-300 bg-clip-text">
                    HK
                  </div>
                  
                  {/* Animated Ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-federal_blue-400/30 animate-pulse"></div>
                  <div className="absolute inset-2 rounded-full border border-navy_blue-400/20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                </div>
              </div>
              
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-federal_blue-500/20 to-duke_blue-500/20 blur-2xl scale-110 group-hover:scale-125 transition-transform duration-500"></div>
            </div>
            
            {/* Profile Info */}
            <div className="flex-1 text-center lg:text-left space-y-6">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                  <span className="block text-transparent bg-gradient-to-r from-federal_blue-300 via-navy_blue-300 to-duke_blue-300 bg-clip-text animate-fade-in">
                    {profile?.name || 'Hidesh Kumar'}
                  </span>
                </h1>
                
                <div className="space-y-2">
                  <p className="text-2xl md:text-3xl font-semibold text-federal_blue-200">
                    {profile?.role || 'Full-Stack Developer'}
                  </p>
                  <p className="text-lg text-navy_blue-200">
                    Software Engineer • AI Enthusiast • Cloud Architect
                  </p>
                </div>
              </div>
              
              <div className="max-w-2xl">
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                  {profile?.headline || 'A curious and committed full-stack developer passionate about building real-world solutions with modern web technologies.'}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <span className="px-4 py-2 bg-federal_blue-500/20 text-federal_blue-200 rounded-full text-sm border border-federal_blue-500/30">
                  🌱 Learning: C#, Java (Spring) & Ruby
                </span>
                <span className="px-4 py-2 bg-navy_blue-500/20 text-navy_blue-200 rounded-full text-sm border border-navy_blue-500/30">
                  💬 Ask me about: AI, n8n, React, Vue
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <a
                  href="#skills"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-federal_blue-600 to-navy_blue-600 text-white font-semibold rounded-xl hover:from-federal_blue-500 hover:to-navy_blue-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Explore My Skills
                </a>
                <a
                  href="#projects"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-duke_blue-500 text-duke_blue-200 font-semibold rounded-xl hover:bg-duke_blue-500/10 transition-all duration-300"
                >
                  View Projects
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
            {/* Skills Section */}
      <section id="skills" className="relative z-10 py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-transparent bg-gradient-to-r from-federal_blue-300 to-duke_blue-300 bg-clip-text">
                Skills & Technologies
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Constantly learning and evolving with the latest technologies to build innovative solutions
            </p>
          </div>
          
          <ScrollStack categories={skillsData} />
        </div>
      </section>

      {/* Featured Projects */}
            {/* Projects Section */}
      <section id="projects" className="relative z-10 py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            <span className="text-transparent bg-gradient-to-r from-navy_blue-300 to-federal_blue-300 bg-clip-text">
              Featured Projects
            </span>
          </h2>
          
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  className="group relative bg-gradient-to-br from-oxford_blue-800/50 to-black/50 backdrop-blur-sm rounded-2xl p-6 border border-federal_blue-500/20 hover:border-federal_blue-400/40 transition-all duration-500 hover:transform hover:-translate-y-2"
                  style={{ 
                    animationDelay: `${index * 200}ms`,
                    animation: 'fade-in 0.8s ease-out forwards'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-federal_blue-500/5 to-navy_blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-4 text-transparent bg-gradient-to-r from-federal_blue-200 to-navy_blue-200 bg-clip-text">
                      {project.title}
                    </h3>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      {project.summary}
                    </p>
                    
                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.stack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-duke_blue-500/20 text-duke_blue-200 text-xs rounded-full border border-duke_blue-500/30"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.stack.length > 4 && (
                        <span className="px-3 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full border border-gray-600/30">
                          +{project.stack.length - 4} more
                        </span>
                      )}
                    </div>
                    
                    {/* Links */}
                    <div className="flex gap-4">
                      {project.repo_url && (
                        <a
                          href={project.repo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-federal_blue-300 hover:text-federal_blue-200 font-medium transition-colors duration-200"
                        >
                          GitHub →
                        </a>
                      )}
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-navy_blue-300 hover:text-navy_blue-200 font-medium transition-colors duration-200"
                        >
                          Live Demo →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <p>Loading amazing projects...</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="bg-gradient-to-br from-oxford_blue-800/30 to-black/30 backdrop-blur-sm rounded-3xl p-12 border border-federal_blue-500/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-gradient-to-r from-federal_blue-300 to-navy_blue-300 bg-clip-text">
              Let's Build Something Amazing Together
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Ready to bring your ideas to life? I'm always excited to work on innovative projects and collaborate with fellow creators.
            </p>
            <a
              href="mailto:hidesh@live.dk"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-federal_blue-600 to-navy_blue-600 text-white font-semibold rounded-xl hover:from-federal_blue-500 hover:to-navy_blue-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Get In Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
