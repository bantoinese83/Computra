/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        void: '#030303',
        surface: '#111111',
        'surface-light': '#141414',
        border: '#27272a',
        'ice-cyan': '#A5F3FC',
        'ice-cyan-bright': '#67E8F9',
        'text-muted': '#a1a1aa',
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        handwriting: ['Caveat', 'Homemade Apple', 'cursive'],
      },
    },
  },
  plugins: [],
};

