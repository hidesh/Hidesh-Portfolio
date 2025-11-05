'use client'

import { useState, useEffect, useRef } from 'react'
import { Mail, User, MessageSquare, Send, CheckCircle, AlertCircle, Shield } from 'lucide-react'

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [altchaPayload, setAltchaPayload] = useState<string | null>(null)
  const [widgetLoaded, setWidgetLoaded] = useState(false)
  const widgetRef = useRef<any>(null)

  useEffect(() => {
    // Wait for custom element to be defined
    if (typeof window !== 'undefined' && customElements) {
      customElements.whenDefined('altcha-widget').then(() => {
        setWidgetLoaded(true)
      })
    }
  }, [])

  useEffect(() => {
    if (!widgetLoaded) return

    const handleStateChange = (ev: CustomEvent) => {
      console.log('ALTCHA State:', ev.detail)
      if (ev.detail.state === 'verified') {
        setAltchaPayload(ev.detail.payload)
      } else {
        setAltchaPayload(null)
      }
    }
    
    const widget = widgetRef.current
    if (widget) {
      widget.addEventListener('statechange', handleStateChange)
      
      return () => {
        widget.removeEventListener('statechange', handleStateChange)
      }
    }
  }, [widgetLoaded])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    // Check if ALTCHA is verified
    if (!altchaPayload) {
      setStatus('error')
      setErrorMessage('Please complete the CAPTCHA verification')
      return
    }

    console.log('Submitting with payload:', altchaPayload)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          altchaPayload,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      setStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setAltchaPayload(null)
      
      // Reset ALTCHA widget
      if (widgetRef.current && typeof widgetRef.current.reset === 'function') {
        widgetRef.current.reset()
      }
      
      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000)
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const remainingChars = 2000 - formData.message.length

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {/* Name Field */}
      <div className="space-y-2">
        <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-foreground">
          <User className="h-4 w-4 text-branding-600" />
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          maxLength={100}
          placeholder="Your name"
          className="w-full px-4 py-3 bg-muted/50 border border-branding-200 dark:border-branding-800 rounded-lg focus:ring-2 focus:ring-branding-500 focus:border-branding-500 transition-all outline-none text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Mail className="h-4 w-4 text-branding-600" />
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          maxLength={100}
          placeholder="your.email@example.com"
          className="w-full px-4 py-3 bg-muted/50 border border-branding-200 dark:border-branding-800 rounded-lg focus:ring-2 focus:ring-branding-500 focus:border-branding-500 transition-all outline-none text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Subject Field */}
      <div className="space-y-2">
        <label htmlFor="subject" className="flex items-center gap-2 text-sm font-medium text-foreground">
          <MessageSquare className="h-4 w-4 text-branding-600" />
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          maxLength={200}
          placeholder="What is this about?"
          className="w-full px-4 py-3 bg-muted/50 border border-branding-200 dark:border-branding-800 rounded-lg focus:ring-2 focus:ring-branding-500 focus:border-branding-500 transition-all outline-none text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Message Field */}
      <div className="space-y-2">
        <label htmlFor="message" className="flex items-center justify-between text-sm font-medium text-foreground">
          <span className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-branding-600" />
            Message
          </span>
          <span className={`text-xs ${remainingChars < 100 ? 'text-red-500' : 'text-muted-foreground'}`}>
            {remainingChars} characters remaining
          </span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          maxLength={2000}
          rows={6}
          placeholder="Your message here..."
          className="w-full px-4 py-3 bg-muted/50 border border-branding-200 dark:border-branding-800 rounded-lg focus:ring-2 focus:ring-branding-500 focus:border-branding-500 transition-all outline-none text-foreground placeholder:text-muted-foreground resize-none"
        />
      </div>

      {/* ALTCHA CAPTCHA */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
          <Shield className="h-4 w-4 text-branding-600" />
          Security Verification
        </label>
        <div className="bg-muted/30 border border-branding-200 dark:border-branding-800 rounded-lg p-4">
          {!widgetLoaded ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 border-2 border-branding-600 border-t-transparent rounded-full animate-spin" />
              <span className="ml-3 text-sm text-muted-foreground">Loading verification...</span>
            </div>
          ) : (
            // @ts-ignore - Custom element type defined in src/types/altcha.d.ts
            <altcha-widget
              ref={widgetRef}
              challengeurl="/api/altcha/challenge"
              hidelogo
            />
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          This helps protect against spam and automated submissions
        </p>
      </div>

      {/* Status Messages */}
      {status === 'success' && (
        <div className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-600 dark:text-green-400">
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm font-medium">Message sent successfully! I'll get back to you soon.</p>
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 dark:text-red-400">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm font-medium">{errorMessage}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-branding-600 to-branding-800 hover:from-branding-500 hover:to-branding-700 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed glow-hover"
      >
        {status === 'loading' ? (
          <>
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="h-5 w-5" />
            Send Message
          </>
        )}
      </button>
    </form>
  )
}
