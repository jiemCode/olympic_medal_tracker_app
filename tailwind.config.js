/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:   '#2c4d14',
        secondary: '#f58e03',
        accent:    '#dde35f',
        soft:      '#f6dcdd',
      },
    },
  },
  plugins: [],
}
