/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0F172A", // Slate 900 - Corporate Dark Blue
          light: "#334155", // Slate 700
        },
        accent: {
          DEFAULT: "#3B82F6", // Blue 500 - Action Color
          hover: "#2563EB", // Blue 600
        },
        success: "#10B981", // Emerald 500
        warning: "#F59E0B", // Amber 500
        danger: "#EF4444", // Red 500
        background: {
          light: "#F8FAFC", // Slate 50
          card: "#FFFFFF",
        },
        border: {
          DEFAULT: "#E2E8F0", // Slate 200
        },
      },
    },
  },
  plugins: [],
};
