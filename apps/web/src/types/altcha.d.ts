import type * as React from 'react'

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'altcha-widget': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        challengeurl?: string
        hidelogo?: boolean
      }, HTMLElement>
    }
  }
}
