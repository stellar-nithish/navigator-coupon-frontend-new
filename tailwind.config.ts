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
        navigator: {
          50: '#f9f8f6',
          100: '#f2eee9',
          200: '#e4dcce',
          300: '#d3c4ad',
          400: '#bfa78a',
          500: '#ab8d6c',
          600: '#947556',
          700: '#7a5d45',
          800: '#644d3b',
          900: '#524032',
          950: '#2b2119',
        },
        forge: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        clay: '#c46849',
        olive: '#4a5d4e',
        navy: '#1d2a3a',
        charcoal: '#1c1d1f',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
