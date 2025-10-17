'use client'

import { Github, Linkedin, Mail, ExternalLink } from 'lucide-react'

const socialLinks = [
  { name: 'GitHub', href: 'https://github.com/hidesh', icon: Github },
  { name: 'LinkedIn', href: 'https://linkedin.com/in/hidesh', icon: Linkedin },
  { name: 'Email', href: 'mailto:hidesh@live.dk', icon: Mail },
]

const quickLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-muted/50 backdrop-blur-md border-t border-branding-200 dark:border-branding-800">
      <div className="container mx-auto px-6 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-branding-600 to-branding-800 flex items-center justify-center">
                <span className="text-white font-bold text-lg">HK</span>
              </div>
              <span className="text-xl font-bold text-gradient">
                Hidesh Kumar
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Software Engineer passionate about building exceptional digital experiences with modern technologies.
            </p>
            <div className="flex items-center space-x-4">
              {socialLinks.map((link) => {
                const Icon = link.icon
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-branding-600 transition-colors duration-200 p-2 rounded-lg hover:bg-branding-500/10"
                    aria-label={link.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-branding-600 transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Get In Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="h-4 w-4 text-branding-600" />
                <a
                  href="mailto:hidesh@live.dk"
                  className="text-muted-foreground hover:text-branding-600 transition-colors duration-200"
                >
                  hidesh@live.dk
                </a>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <ExternalLink className="h-4 w-4 text-branding-600" />
                <a
                  href="https://hidesh.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-branding-600 transition-colors duration-200"
                >
                  hidesh.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="pt-8 border-t border-branding-200 dark:border-branding-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-muted-foreground text-sm">
              © {currentYear} Hidesh Kumar. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <a
                href="#privacy"
                className="text-gray-400 hover:text-federal_blue-300 transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a
                href="#terms"
                className="text-gray-400 hover:text-federal_blue-300 transition-colors duration-200"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}