/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        '3d-enter': {
          '0%': { opacity: '0', transform: 'perspective(1200px) rotateX(15deg) translateY(30px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'perspective(1200px) rotateX(0deg) translateY(0) scale(1)' },
        },
        '3d-float': {
          '0%, 100%': { transform: 'perspective(1200px) translateY(0px) rotateY(0deg)' },
          '50%': { transform: 'perspective(1200px) translateY(-8px) rotateY(-3deg)' },
        },
      },
      animation: {
        '3d-enter': '3d-enter 0.5s ease-out',
        '3d-float': '3d-float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
