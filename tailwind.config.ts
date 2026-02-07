import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Material 3 Surface Colors
        surface: {
          DEFAULT: '#0a0a0a',
          variant: '#1c1c1c',
          elevated: '#252525',
        },
        // Material 3 Primary (Gold)
        primary: {
          DEFAULT: '#c9a227',
          container: '#f9e5a3',
          on: '#000000',
        },
        // Gold/Sequin accent
        accent: {
          DEFAULT: '#c9a227',
          light: '#f4d03f',
          dark: '#8b6914',
          muted: '#b8982f',
        },
        // On Surface colors
        'on-surface': {
          DEFAULT: '#ffffff',
          variant: '#e0e0e0',
        },
        // Outline
        outline: {
          DEFAULT: '#5c5c5c',
          variant: '#3d3d3d',
        },
        // Error
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
        },
        // Warning
        warning: {
          DEFAULT: '#f59e0b',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', 'sans-serif'],
        display: ['Roboto', 'system-ui', 'sans-serif'],
      },
      animation: {
        'sequin': 'sequin 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce': 'bounce 0.5s ease-in-out',
      },
      keyframes: {
        sequin: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;