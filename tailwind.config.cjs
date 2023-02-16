/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        show: {
          "0%": { opacity: "50%", scale: "0%" },
          "100%": { opacity: "100%", sclae: "100%" },
        },
      },
      animation: {
        show: "show 200ms ease-in",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
