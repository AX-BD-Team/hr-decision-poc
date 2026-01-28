/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        decisionBlue: '#4F8CFF',
        alertRed: '#FF4D4F',
        neutralGray: '#AAB4C5',
        contextGreen: '#10B981',
        appBg: '#0B1220',
        panelBg: '#111A2E',
        textMain: '#E6EAF2',
        textSub: '#AAB4C5',
      },
    },
  },
  plugins: [],
}
