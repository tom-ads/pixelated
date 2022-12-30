// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontSize: {
      // Using a font-size * 1.4 multiplier line-height
      '2xs': ['0.625rem', '0.875rem'], // FS: 10px, LH: 14px
      xs: ['0.75rem', '1.0625rem'], // FS: 12px, LH: 17px
      sm: ['0.875rem', '1.25rem'], // FS: 14px, LH: 20px
      base: ['1rem', '1.375rem'], // FS: 16px, LH: 22px
      lg: ['1.125rem', '1.5625rem'], // FS: 18px, LH: 25px
      xl: ['1.25rem', '1.75rem'], // FS: 20px, LH: 28px
      '2xl': ['1.5rem', '2.125rem'], // FS: 24px, LH: 28px
      '3xl': ['2rem', '2.8125rem'], // FS: 32px, LH: 45px
      '4xl': ['2.25rem', '3.125rem'], // FS: 36px, LH: 50px
    },
    colors: {
      white: '#FFFFFF',
      transparent: 'transparent',
      purple: {
        90: '#0B012C',
      },
      cyan: {
        90: '#1C2E5A',
        80: '#22386D',
      },
      yellow: {
        80: '#FFE700',
        70: '#FFE700',
        60: '#FFEC36',
      },
      green: {
        50: '#00F946',
      },
      red: {
        50: '#F90000',
      },
      gray: {
        30: '#DBDBDB',
      },
    },
    boxShadow: {
      sm: '0px 0px 5px 0px rgb(0, 0, 0)',
      md: '0px 0px 5px 0.1px rgb(0, 0, 0)',
      lg: '0px 0px 5px 0.2px rgb(0, 0, 0)',
      glow: '0px 0px 5px 0px rgb(218, 223, 231)',
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
