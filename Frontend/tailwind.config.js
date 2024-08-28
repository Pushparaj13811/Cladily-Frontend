/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Playfair Display", "serif"],
        body: ["Montserrat", "sans-serif"],
      },
      colors: {
        primary: "#c8f1d9",
        secondary: "#285c3f",
        tertery: "#000",
      },
    },
  },
  plugins: [],
};
