import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "tg-theme": {
          bg: "var(--tg-theme-bg-color)",
          text: "var(--tg-theme-text-color)",
          button: "var(--tg-theme-button-color)",
          "button-text": "var(--tg-theme-button-text-color)",
        },
        "tg-border": "rgba(0, 0, 0, 0.1)", // 薄いグレーのボーダー用
      },
    },
  },
  plugins: [],
} satisfies Config;
