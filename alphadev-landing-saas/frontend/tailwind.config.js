/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        alpha: {
          red: "#ef1d2f",
          dark: "#07070a",
          panel: "#111116",
        },
      },
      boxShadow: {
        glow: "0 0 45px rgba(239, 29, 47, 0.22)",
      },
    },
  },
  plugins: [],
};
