import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1B2FFF',
        secondary: '#F5F8FE',
        dark: '171b20',
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [
  ],
} satisfies Config;