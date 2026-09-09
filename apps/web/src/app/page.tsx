import React from 'react'
import SignalSculpture from '@/components/ui/signal-sculpture'
import './portfolio.css'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import type { Metadata } from 'next'
import { siteConfig, getOpenGraphMetadata, getTwitterMetadata } from '@/lib/seo'

// Lazy load kun client komponenter med loading states
const ContactForm = dynamic(() =>
  import('@/components/contact-form').then(mod => ({
    default: mod.ContactForm,
  }))
)

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
      summary:
        'Progressive Web App for digitizing car wash operations. Features dynamic pricing algorithm with API integration (license plate, size, weight), online booking, customer login, real-time status, Firebase Cloud Messaging notifications, and Google Cloud Storage for images. Built with React, Node.js/Express, Supabase (PostgreSQL). Mobile-first PWA that reduces manual errors and increases revenue through automation.',
      tags: [
        'React',
        'Node.js',
        'Express',
        'Supabase',
        'PostgreSQL',
        'Firebase',
        'Google Cloud',
        'PWA',
      ],
      cover_image: null,
      live_url: 'https://auto-carwash-code.vercel.app',
      repo_url: null,
    },
    {
      id: '2',
      title: 'SQL Agent - Support Solutions',
      summary:
        'AI-powered SQL agent system for automated support solutions with intelligent query generation and data analysis.',
      tags: ['AI', 'SQL', 'Python', 'Machine Learning', 'Automation'],
      cover_image: null,
      live_url: null,
      repo_url: 'https://github.com/hidesh/sql-agent---Support-Solutions',
    },
    {
      id: '3',
      title: 'Support Solutions RAG',
      summary:
        'Retrieval-Augmented Generation system for intelligent support documentation and knowledge base management.',
      tags: ['RAG', 'AI', 'LangChain', 'Vector Database', 'NLP'],
      cover_image: null,
      live_url: null,
      repo_url: 'https://github.com/hidesh/supportsolutions-rag',
    },
    {
      id: '4',
      title: 'Newsletter Automation',
      summary:
        'Automated newsletter system with intelligent content generation, scheduling, and distribution capabilities.',
      tags: [
        'Automation',
        'Node.js',
        'Email Marketing',
        'Scheduling',
        'API Integration',
      ],
      cover_image: null,
      live_url: null,
      repo_url: 'https://github.com/hidesh/Newsletter-Automation',
    },
  ]

  // Mock skills data til vi fÃ¥r en rigtig getSkills funktion
  const skillCategories = [
    {
      title: 'Frontend Development',
      color: 'bg-gradient-to-br from-branding-500 to-branding-700',
      skills: [
        'React',
        'Vue.js',
        'Angular',
        'Next.js',
        'Nuxt.js',
        'Svelte',
        'TypeScript',
        'JavaScript',
        'HTML5',
        'CSS3',
        'Sass',
        'Tailwind CSS',
      ],
    },
    {
      title: 'Backend Development',
      color: 'bg-gradient-to-br from-primary-600 to-primary-800',
      skills: [
        'Node.js',
        'Express',
        'PHP',
        'Laravel',
        'C#',
        '.NET',
        'Java (Spring)',
        'Ruby',
        'Python',
      ],
    },
    {
      title: 'AI & Machine Learning',
      color: 'bg-gradient-to-br from-purple-600 to-purple-800',
      skills: [
        'n8n',
        'RAG',
        'LangChain',
        'OpenAI API',
        'Anthropic Claude',
        'Vector Databases',
        'Embeddings',
        'Prompt Engineering',
        'Fine-tuning',
        'TensorFlow',
        'PyTorch',
        'Hugging Face',
      ],
    },
    {
      title: 'Cloud & Infrastructure',
      color: 'bg-gradient-to-br from-blue-600 to-blue-800',
      skills: [
        'AWS',
        'Google Cloud',
        'Azure',
        'Supabase',
        'Firebase',
        'Vercel',
        'Netlify',
        'DigitalOcean',
        'Heroku',
        'Railway',
      ],
    },
    {
      title: 'Database & Storage',
      color: 'bg-gradient-to-br from-mid-gray to-dark-gray',
      skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'Firebase', 'Redis'],
    },
    {
      title: 'Business & Consulting',
      color: 'bg-gradient-to-br from-branding-500 to-branding-700',
      skills: [
        'Digital Transformation',
        'Technical Sales',
        'IT Consulting',
        'Customer Support',
        'Product Strategy',
        'Project Management',
        'Client Relations',
        'Technical Training',
        'System Integration',
        'Troubleshooting',
        'Service Delivery',
        'Solution Architecture',
      ],
    },
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
        'Agile development and team collaboration',
      ],
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
        'Project management and creative problem solving',
      ],
    },
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
        'Designed entire UI and user journey in Figma, including a functional prototype',
      ],
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
        'Communicating solutions clearly and understandably to a diverse customer base',
      ],
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
        'Installed and repaired intercom systems in residential buildings with a focus on reliability and a positive service experience',
      ],
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
        'Contributed to Git-flow and deployment processes',
      ],
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
        'Responsible for the media department with photo, video and 3D-print, from technical setup to guidance',
      ],
    },
    {
      id: 6,
      type: 'work' as const,
      title: 'Member & Participant â€“ Girls in IT Zealand',
      company: 'Volunteer Work',
      period: 'September 2023 - Present',
      description: [
        'Participating in student initiative working to create more visibility and space for women in IT',
        'Contributing with help for workshops, design and development of the website (Vue.js)',
        'Working for diversity and for more women to be represented in the IT industry',
        'Helping to ensure an inclusive community',
      ],
    },
  ]

  return (
    <div className="portfolio">
      <section id="home" className="portfolio-hero portfolio-shell">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="status-dot" /> SOFTWARE ENGINEER · BASED IN DENMARK
          </p>
          <h1>
            Human ideas.
            <br />
            Thoughtful code.
            <br />
            <em>Real impact.</em>
          </h1>
          <p className="hero-description">
            I’m Hidesh. I build web experiences and intelligent tools that make
            complex things feel simple.
          </p>
          <div className="portfolio-actions">
            <a href="#projects" className="portfolio-button">
              Explore my work <span aria-hidden="true">↗</span>
            </a>
            <a href="#contact" className="portfolio-text-link">
              Let’s talk <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="hero-person">
            <Image
              src="/Hidesh-profile.png"
              alt="Hidesh Kumar"
              width={44}
              height={44}
              priority
            />
            <span>
              Developer by craft.
              <br />
              <strong>Creative by nature.</strong>
            </span>
          </div>
        </div>
        <SignalSculpture />
        <div className="hero-bottom">
          <span>WEB DEVELOPMENT / AI / AUTOMATION</span>
          <a href="#projects">SCROLL TO EXPLORE ↓</a>
        </div>
      </section>

      <section id="projects" className="portfolio-section portfolio-shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">01 / SELECTED WORK</p>
            <h2>Ideas put to work.</h2>
          </div>
          <p>
            A few things I’ve built to connect people,
            <br />
            simplify workflows, and solve real problems.
          </p>
        </div>
        <div className="work-grid">
          {projects.map((project, index) => (
            <article key={project.id} className="work-card">
              <a
                className={`work-visual work-visual-${index}`}
                href={project.live_url || project.repo_url || '#contact'}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Explore ${project.title}`}
              >
                <span className="work-number">
                  0{index + 1} /{' '}
                  {index === 0
                    ? 'WEB APPLICATION'
                    : index === 3
                      ? 'AUTOMATION'
                      : 'APPLIED AI'}
                </span>
                {index === 0 ? (
                  <div className="carwash-preview">
                    <div className="preview-top">
                      AUTOMATE <span>CARWASH ↗</span>
                    </div>
                    <div className="preview-title">
                      A cleaner way
                      <br />
                      to book your wash.
                    </div>
                    <div className="preview-track">
                      <span>01 Select</span>
                      <span>02 Book</span>
                      <span>03 Shine</span>
                    </div>
                    <div className="preview-cta">
                      Your next wash, simplified. →
                    </div>
                  </div>
                ) : index === 1 ? (
                  <div className="code-preview">
                    <span>ASK A QUESTION</span>
                    <p>What does the data tell us?</p>
                    <code>
                      <b>SELECT</b> answers
                      <br />
                      <b>FROM</b> your_data
                      <br />
                      <b>WHERE</b> complexity = 0;
                    </code>
                  </div>
                ) : index === 2 ? (
                  <div className="rag-preview">
                    <span>DOCUMENTS</span>
                    <div>
                      KNOWLEDGE <span>↗</span>
                    </div>
                    <span>CONNECTED TO THE RIGHT ANSWER</span>
                  </div>
                ) : (
                  <div className="flow-preview">
                    <span>IDEA</span>
                    <i>→</i>
                    <span>CREATE</span>
                    <i>→</i>
                    <span>SEND</span>
                  </div>
                )}
                <span className="visual-note">
                  PROJECT CONCEPT / {project.tags[0].toUpperCase()}
                </span>
                <span className="work-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
              <div className="work-info">
                <h3>
                  <a
                    href={project.live_url || project.repo_url || '#contact'}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {project.title}
                  </a>
                </h3>
                <p>
                  {index === 0
                    ? 'A mobile-first booking platform connecting customers, pricing, and daily car wash operations.'
                    : project.summary}
                </p>
                <div className="work-tags">
                  {project.tags.slice(0, 4).map(tag => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="about-section">
        <div className="portfolio-shell about-grid">
          <div>
            <p className="eyebrow">02 / THE PERSON BEHIND THE CODE</p>
            <h2>
              Technical mind.
              <br />
              <em>Creative instinct.</em>
            </h2>
            <div className="about-portrait">
              <Image
                src="/Hidesh-profile.png"
                alt="Portrait of Hidesh Kumar"
                width={240}
                height={280}
                sizes="240px"
              />
              <span>
                HIDESH KUMAR
                <br />
                DEVELOPER & MAKER
              </span>
            </div>
          </div>
          <div className="about-copy">
            <p>
              I work at the intersection of software, design, and the people who
              use it.
            </p>
            <p>
              From full-stack web applications to AI-powered support tools, I
              enjoy turning complicated workflows into useful, approachable
              experiences. My background in technical support keeps me close to
              the problems people actually need solved.
            </p>
            <p>
              Outside of code, I make music. The same curiosity drives both:
              finding patterns, experimenting with ideas, and caring about the
              details that make something feel right.
            </p>
            <a href="#contact" className="portfolio-text-link">
              Have something in mind? Let’s connect ↗
            </a>
          </div>
        </div>
      </section>

      <section id="skills" className="portfolio-section portfolio-shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">03 / MY TOOLKIT</p>
            <h2>Built on curiosity.</h2>
          </div>
          <p>
            The technologies and disciplines
            <br />I bring together in my work.
          </p>
        </div>
        <div className="toolkit-grid">
          {skillCategories.map((category, index) => (
            <div key={category.title} className="toolkit-item">
              <span className="eyebrow">0{index + 1}</span>
              <h3>{category.title}</h3>
              <p>{category.skills.slice(0, 8).join(' · ')}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="experience" className="portfolio-section portfolio-shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">04 / THE JOURNEY</p>
            <h2>Always moving forward.</h2>
          </div>
        </div>
        <div className="journey-grid">
          <div>
            <h3 className="journey-label">EXPERIENCE</h3>
            {workTimeline.map(item => (
              <details className="journey-item" key={item.id}>
                <summary>
                  <span>
                    <strong>{item.title}</strong>
                    <span>{item.company}</span>
                  </span>
                  <span className="journey-period">
                    {item.period}
                    <b aria-hidden="true">+</b>
                  </span>
                </summary>
                <ul>
                  {item.description.map(line => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
          <div id="education">
            <h3 className="journey-label">EDUCATION</h3>
            {educationTimeline.map(item => (
              <div className="education-item" key={item.id}>
                <span>{item.period}</span>
                <h3>{item.title}</h3>
                <p>{item.company}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="portfolio-section contact-section">
        <div className="portfolio-shell contact-grid">
          <div>
            <p className="eyebrow">05 / LET’S MAKE SOMETHING</p>
            <h2>
              Good things start
              <br />
              with a <em>hello.</em>
            </h2>
            <p>
              A project, an opportunity, or an interesting idea?
              <br />
              I’d love to hear about it.
            </p>
            <a className="contact-email" href="mailto:hidesh@live.dk">
              hidesh@live.dk ↗
            </a>
            <div className="contact-socials">
              <a
                href="https://github.com/hidesh"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub ↗
              </a>
              <a
                href="https://linkedin.com/in/hidesh"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn ↗
              </a>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </div>
  )
}
