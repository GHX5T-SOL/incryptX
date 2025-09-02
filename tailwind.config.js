/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-cyan': '#00FFF0',
        'neon-pink': '#FF00CC',
        'neon-purple': '#8A2BE2',
        'neon-blue': '#00BFFF',
        'space-black': '#0b0b14',
      },
      fontFamily: {
        'tech': ['Orbitron', 'Rajdhani', 'Chakra Petch', 'Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
