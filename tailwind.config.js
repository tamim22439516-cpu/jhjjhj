/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Hind Siliguri', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        '3xs': '0 1px 2px rgba(0, 0, 0, 0.04)',
        '2xs': '0 1px 3px rgba(0, 0, 0, 0.06)',
      },
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
    },
  },
  plugins: [],
}
