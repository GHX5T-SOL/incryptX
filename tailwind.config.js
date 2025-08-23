/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-pink': '#FF69B4',
        'hat-blue': '#00BFFF',
        'dog-white': '#FFFFFF',
        'meme-black': '#1a1a1a',
        'pastel-yellow': '#FFFACD',
        'pastel-green': '#98FB98',
      },
      fontFamily: {
        'comic': ['"Comic Neue"', 'cursive'],
        'fun': ['"Bangers"', 'cursive'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      }
    },
  },
  plugins: [],
}
