/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-pink': '#FF69B4',
        'hat-blue': '#00BFFF',
        'dog-white': '#FFFFFF',
        'meme-black': '#000000',
      },
      fontFamily: {
        'comic': ['"Comic Neue"', 'cursive'],
      },
    },
  },
  plugins: [],
}
