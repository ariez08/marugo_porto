import { title } from 'framer-motion/client'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html', 
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    container: {
      center: true,
    },
    
    colors:{
      transparent: 'transparent',
      current: 'currentColor',
      'black': {
        DEFAULT: '#000000',
        100: '#1c1c1c',
        200: '#0d0d0d',
      },
      'white': {
        DEFAULT: '#ffffff',
        300: '#FFF5E4'
      },
      'purple': {
        DEFAULT: '#b603fc',
        100: '#CB9DF0',
        200: '#8967B3'
      },
      'midnight': '#121063',
      'metal': '#565584',
      'tahiti': '#3ab7bf',
      'silver': '#ecebff',
      'bubble-gum': '#ff77e9',
      'bermuda': '#78dcca',
      'pink': '#FF9BC2',
      'blue': '#64A0AD',
      'gray': {
        DEFAULT: '#B4B4B3',
        100: '#F0F0F0',
        200: '#F1EFEF',
        300: '#B4B4B3',
        400:'#B7B7B7',
        500: '#9D9D9D',
      },
      'yellow': {
        100: '#fbfbd5',
        200: '#fedc70',
      },
      'orange': '#FFA500',
      'lime-green': '#a1fc03',
      'teal': '#7ED7C1',
      'green': {
        DEFAULT: '#16C47F'
      },
      'red': {
        DEFAULT: '#F93827'
      },
      'peach': {
        DEFAULT: '#FFE3E1',
        100: '#FFD1D1',
        200: '#FF9494',
      },
    },

    extend: {
      animation: {
        marquee: 'marquee 1s ease-in-out infinite',
      },
      screens: {
        ssm:'375px',
        sm:'640px',
        md:'768px',
        lg:'1024px',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(-10%)' },
          '50%': { transform: 'translateX(15%)' },
          '100%': { transform: 'translateX(-10%)' },
        },
      },
      fontFamily:{
        school: ["Schoolbell", "sans-serif"],
        londrina: ["Londrina Shadow", "sans-serif"],
        nav:["Pacifico", "sans-serif"],
        desc:["Delius", "sans-serif"],
        name:["Sour Gummy", "sans-serif"],
        magnifico:["Magnifico", "sans-serif"],
      },
      letterSpacing: {
        extra: '0.25em',
      },
      borderRadius: {
        'custom': '1.5rem',
        'extra-large': '3rem',
      },
    },
  },
  plugins: [],
}
