/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif']
      },
      colors: {
        'primary': '#E67529',
        'secondary': '#2B2B2B'
      },
    },
  },
  plugins: [],
}
