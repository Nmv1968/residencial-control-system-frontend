/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#1F3A5F",
        secondary: "#2E7D32",
        warning: "#F9A825",
        error: "#C62828",
        background: {
          light: "#F5F7FA",
          dark: "#0F172A",
        },
      },
    },
  },
  plugins: [],
};
