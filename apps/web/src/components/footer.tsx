'use client'
import Link from 'next/link'
import { CookieSettingsButton } from '@/components/consent/cookie-settings-button'

export function Footer() {
  return <footer className="border-t border-border bg-background px-6 py-8"><div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-6 text-xs text-muted-foreground"><Link href="/" className="font-medium text-foreground">Hidesh Kumar <span className="ml-3 font-normal text-muted-foreground">© {new Date().getFullYear()}</span></Link><p>Made with curiosity. Built with care.</p><div className="flex items-center gap-5"><Link href="/cookie-policy">Cookie policy</Link><CookieSettingsButton /><Link href="/#home">Back to top ↑</Link></div></div></footer>
}
