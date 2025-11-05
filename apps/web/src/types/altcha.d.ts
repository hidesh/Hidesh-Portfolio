declare namespace JSX {
  interface IntrinsicElements {
    'altcha-widget': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      challengeurl?: string
      hidelogo?: boolean
      onstatechange?: (event: CustomEvent<{ state: string; payload: string }>) => void
    }, HTMLElement>
  }
}
