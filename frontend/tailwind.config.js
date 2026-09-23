/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1d4ed8", // blue-700
        secondary: "#1e40af", // blue-800
        dark: "#0f172a", // slate-900
        glass: "rgba(255, 255, 255, 0.1)",
      }
    },
  },
  plugins: [],
}
