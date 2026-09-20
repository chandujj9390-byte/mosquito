/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./*.html",
    "./js/**/*.js",
    "./styles/**/*.css"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: '#C5A059',
          goldLight: '#E5C378',
          goldDark: '#9E7831',
          charcoal: '#121212',
          surface: '#F9F9F8',
          surfaceElevated: '#F4F4F2',
          stone: '#E8E8E5'
        }
      },
      fontFamily: {
        editorial: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        brand: ['"Cinzel"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"Space Grotesk"', 'monospace']
      }
    }
  },
  plugins: []
};
