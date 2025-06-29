// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // This covers all JS/TS/JSX/TSX files in src
  ],
  theme: {
    extend: {
      colors: {
        'brand-cream': '#FAF7F0',
        'brand-dark': '#2D2D2D',
        'brand-brown': '#A47551',
        'brand-beige': '#D1BFA7',
        'brand-light-green': '#B7D5AC',
        'brand-teal': '#6D9886',
        'brand-dark-teal': '#5C8676',
      },
    },
  },
  plugins: [],
}