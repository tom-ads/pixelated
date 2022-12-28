// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      white: '#FFFFFF',
      transparent: 'transparent',
      purple: {
        90: '#0B012C',
      },
      cyan: {
        90: '#1C2E5A',
      },
      yellow: {
        60: '#FFEC36',
      },
      green: {
        50: '#00F946',
      },
      red: {
        50: '#F90000',
      },
    },
    boxShadow: {
      none: defaultTheme.boxShadow.none,
    },
    extend: {
      fontFamily: {
        chango: ['Chango', 'serif'],
      },
    },
  },
  plugins: [],
}
