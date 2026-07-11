import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#120A2E",
        navbar: "#140A35",
        "primary-purple": "#7B61FF",
        "secondary-purple": "#9A7BFF",
        "text-primary": "#FFFFFF",
        "text-secondary": "#C8C4DD",
        border: "rgba(255,255,255,0.08)",
        "button-dark": "#2D2448",
        "card-white": "#FFFFFF"
      }
    }
  }
};

export default config;