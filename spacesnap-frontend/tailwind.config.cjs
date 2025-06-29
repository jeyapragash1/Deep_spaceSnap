// tailwind.config.js
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
        'neutral-light': '#f5f5f5', // Added
        'primary-teal': '#0d9488',   // A nice modern teal
        'accent-gold': '#f59e0b',    // A warm, modern gold/amber
      },
      // Add this for the custom animation
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
    // This plugin is used for the scrollbar-hide class in ProjectSection
    require('tailwind-scrollbar-hide'),
  ],
}