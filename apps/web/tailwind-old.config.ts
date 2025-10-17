import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        black: {
          DEFAULT: '#02010a',
          100: '#000002',
          200: '#010004',
          300: '#010106',
          400: '#020107',
          500: '#02010a',
          600: '#140a64',
          700: '#2713bf',
          800: '#5c49ed',
          900: '#aea4f6'
        },
        oxford_blue: {
          DEFAULT: '#04052e',
          100: '#010109',
          200: '#020213',
          300: '#02031c',
          400: '#030426',
          500: '#04052e',
          600: '#0b0d83',
          700: '#1316d8',
          800: '#5659f0',
          900: '#abacf8'
        },
        federal_blue: {
          DEFAULT: '#140152',
          100: '#040010',
          200: '#080020',
          300: '#0c0030',
          400: '#100141',
          500: '#140152',
          600: '#2802a6',
          700: '#3c03fa',
          800: '#7d55fd',
          900: '#beaafe'
        },
        navy_blue: {
          DEFAULT: '#22007c',
          100: '#070018',
          200: '#0d0031',
          300: '#140049',
          400: '#1a0062',
          500: '#22007c',
          600: '#3500c8',
          700: '#5416ff',
          800: '#8d64ff',
          900: '#c6b1ff'
        },
        duke_blue: {
          DEFAULT: '#0d00a4',
          100: '#030021',
          200: '#050041',
          300: '#080062',
          400: '#0b0083',
          500: '#0d00a4',
          600: '#1300e9',
          700: '#402fff',
          800: '#8074ff',
          900: '#bfbaff'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'Menlo', 'Monaco', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '66ch',
            color: 'hsl(var(--foreground))',
            '[data-rehype-pretty-code-fragment]': {
              backgroundColor: 'hsl(var(--muted))',
            },
          },
        },
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;