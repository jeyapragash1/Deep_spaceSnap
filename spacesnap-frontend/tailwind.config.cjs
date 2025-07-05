// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neutral-dark': '#232323',
        'neutral-light': '#f5f5f5',
        'primary-teal': '#0d9488',
        'accent-gold': '#f59e0b',
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [
    // --- THIS IS THE NEW LINE ---
    // Add the official typography plugin here.
    require('@tailwindcss/typography'),

    // This plugin is used for the scrollbar-hide class
    require('tailwind-scrollbar-hide'),
  ],
}