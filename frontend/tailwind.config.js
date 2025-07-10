/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"], // Custom font family
      },
      colors: {
        primary: "#4F46E5",
        secondary: "#6B7280",
        accent: "#F59E0B",
        "primary-dark": "#1a202c",
      },
    },
  },
  plugins: [
    // Add any Tailwind CSS plugins here
  ],
};
