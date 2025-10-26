/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#faf9f7',
          100: '#f5f3f0',
          200: '#e8e5df',
          300: '#d4cec3',
          400: '#b8ae9e',
          500: '#9c8f7b',
          600: '#7d6f5c',
          700: '#5f544a',
          800: '#463e35',
          900: '#2d2822'
        },
        accent: {
          50: '#fef3f2',
          100: '#fee5e2',
          200: '#fecfc9',
          300: '#fcada3',
          400: '#f87f6e',
          500: '#ef5844',
          600: '#dc3c28',
          700: '#b9301e',
          800: '#992b1c',
          900: '#7f291d'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      }
    }
  },
  plugins: [],
};