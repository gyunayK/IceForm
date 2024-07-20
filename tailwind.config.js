/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  safelist: [
    'text-blue',
    'text-darkblue',
    'text-pink',
    'text-purple',
    'text-green',
    'text-yellow',
    'text-orange',
    'text-red',
    'text-beaver',
    'text-black',
    'text-white',
    'text-spray-200'
  ],
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    fontFamily: {
      roboto: ['Roboto', 'sans-serif']
    },
    extend: {
      backgroundColor: {
        'green-10': 'rgba(52, 211, 153, 0.1)',
        'red-10': 'rgba(239, 68, 68, 0.1)',
        'yellow-10': 'rgba(251, 191, 36, 0.1)',
        'gray-50': 'rgba(61, 60, 62, 0.4)',
        'gray-55': 'rgba(61, 60, 62, 0.8)'
      },
      colors: {
        shark: {
          50: '#f5f6f6',
          100: '#e6e7e7',
          200: '#cfd1d2',
          300: '#b8babc',
          400: '#84898c',
          500: '#696e71',
          600: '#5a5e60',
          700: '#4c5052',
          800: '#434547',
          900: '#3b3c3e',
          950: '#1e1f20'
        },
        spray: {
          50: '#ebfeff',
          100: '#ccfdff',
          200: '#8cecff',
          300: '#62e2fe',
          400: '#1bcff5',
          500: '#00addb',
          600: '#008bab',
          700: '#006e94',
          800: '#005278',
          900: '#003466',
          950: '#0063046'
        },
        blue: '#1BCBF5',
        darkblue: '#588AF7',
        pink: '#FF82D4',
        purple: '#C880F0',
        green: '#92DD78',
        yellow: '#FFB841',
        orange: '#FF8811',
        red: '#EB6E6E',
        lightred: '#FFB5B5',
        beaver: '#A18276',
        white: '#FFFFFF',
        black: '#1E1F20'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')]
}
