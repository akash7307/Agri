/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        leaf:    { DEFAULT: '#3d8b47', light: '#5db356', dark: '#2d6a35', darker: '#1a3d1f' },
        soil:    { DEFAULT: '#7c5c3e', light: '#9a7458', dark: '#5a3e28' },
        harvest: { DEFAULT: '#e8a020', light: '#f5c842', dark: '#b87818' },
        sky:     { DEFAULT: '#4a90d9', light: '#72aee8', dark: '#2e6bad' },
        cream:   { DEFAULT: '#f7f3ed', dark: '#ede8df' },
        bark:    '#3d2b1f',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      animation: {
        'slide-up':   'slideUp 0.5s ease forwards',
        'fade-in':    'fadeIn 0.4s ease forwards',
        'float':      'float 4s ease-in-out infinite',
        'sway':       'leafSway 3s ease-in-out infinite',
        'spin-slow':  'spin-slow 20s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}