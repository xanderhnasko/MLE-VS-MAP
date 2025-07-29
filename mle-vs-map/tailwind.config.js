/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'prior': '#3B82F6',
        'likelihood': '#EF4444',
        'posterior': '#8B5CF6',
        'mle-point': '#F59E0B',
        'map-point': '#10B981',
        border: "var(--border)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: {
          foreground: "var(--muted-foreground)",
        },
      },
    },
  },
  plugins: [],
} 