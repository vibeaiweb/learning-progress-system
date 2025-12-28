/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'neo-black': '#000000',
        'neo-white': '#FFFFFF',
        'neo-yellow': '#FFED4E',
        'neo-cyan': '#00F0FF',
        'neo-magenta': '#FF006E',
      },
      fontFamily: {
        'heading': ['"Space Grotesk"', 'sans-serif'],
        'body': ['"Space Mono"', 'monospace'],
      },
      boxShadow: {
        'neo': '8px 8px 0 #000000',
        'neo-hover': '4px 4px 0 #000000',
        'neo-active': '0 0 0 #000000',
        'neo-sm': '4px 4px 0 #000000',
        'neo-lg': '12px 12px 0 #000000',
      },
      borderWidth: {
        'neo': '4px',
      },
    },
  },
  plugins: [],
};
