import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50:  "#f2f7f2",
          100: "#e4efe4",
          200: "#c6dfc6",
          300: "#97c397",
          400: "#6b9e6b",
          500: "#4d824d",
          600: "#3c6b3c",
          700: "#315631",
          800: "#29452a",
          900: "#223924",
        },
        amber: {
          50:  "#fdf6ef",
          100: "#faeada",
          200: "#f5d0b0",
          300: "#edaf7c",
          400: "#e48a4a",
          500: "#d96f2e",
          600: "#c25824",
          700: "#a14320",
          800: "#823622",
          900: "#6b2e1f",
        },
        cream: {
          50:  "#faf8f3",
          100: "#f4f0e6",
          200: "#ebe3d0",
          300: "#ddd0b4",
          400: "#ccb88e",
          500: "#bda070",
        },
        warm: {
          900: "#2c2a27",
          700: "#5a5652",
          500: "#8a8480",
          300: "#c4c0bb",
          100: "#f0eee9",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 2px 20px rgba(44, 42, 39, 0.06)",
        "soft-lg": "0 8px 40px rgba(44, 42, 39, 0.10)",
        sage: "0 4px 20px rgba(75, 130, 75, 0.20)",
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        "scale-in": "scaleIn 0.3s ease forwards",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
