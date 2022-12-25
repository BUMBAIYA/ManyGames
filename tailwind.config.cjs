/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        2: "#41c9b8",
        4: "#00b2a1",
        8: "#ed5471",
        16: "#d8396d",
        32: "#b81c64",
        64: "#3c2864",
        128: "#ffb33c",
        256: "#f68530",
        512: "#e85938",
        1024: "#57407c",
        2048: "#1480cf",
      },
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
  plugins: [],
};
