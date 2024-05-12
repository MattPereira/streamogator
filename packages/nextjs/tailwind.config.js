/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  darkTheme: "dark",
  darkMode: ["selector", "[data-theme='dark']"],
  // DaisyUI theme colors
  daisyui: {
    themes: [
      {
        light: {
          primary: "#3b2e2a",
          "primary-content": "#ffffff",
          secondary: "#e0e0da",
          "secondary-content": "#ffffff",
          accent: "#2b79a2",
          "accent-content": "#ffffff",
          neutral: "#3b2e2a",
          "neutral-content": "#9d7dce",
          "base-100": "#ffffff",
          "base-200": "#ffffff",
          "base-300": "#e0e0da",
          "base-content": "#3b2e2a",
          info: "#12b5e5",
          success: "#0ba95b",
          warning: "#f99157",
          error: "#ed203d",

          "--rounded-btn": "9999rem",

          ".tooltip": {
            "--tooltip-tail": "6px",
          },
          ".link": {
            textUnderlineOffset: "2px",
          },
          ".link:hover": {
            opacity: "80%",
          },
        },
      },
      {
        dark: {
          primary: "#fcba28",
          "primary-content": "#0f0d0e",
          secondary: "#231f20",
          "secondary-content": "#f9f4da",
          accent: "#f38ba3",
          "accent-content": "#0f0d0e",
          neutral: "#f9f4da",
          "neutral-content": "#9d7dce",
          "base-100": "#1f1f1f",
          "base-200": "#231f20",
          "base-300": "#0f0d0e",
          "base-content": "#f9f4da",
          info: "#12b5e5",
          success: "#0ba95b",
          warning: "#f99157",
          error: "#ed203d",

          "--rounded-btn": "9999rem",

          ".tooltip": {
            "--tooltip-tail": "6px",
            "--tooltip-color": "oklch(var(--p))",
          },
          ".link": {
            textUnderlineOffset: "2px",
          },
          ".link:hover": {
            opacity: "80%",
          },
        },
      },
    ],
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ["Outfit", "sans-serif"],
        outfit: ["Outfit", "sans-serif"],
        paytone: ["Paytone One", "sans-serif"],
      },
      boxShadow: {
        center: "0 0 12px -2px rgb(0 0 0 / 0.05)",
      },
      animation: {
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
};
