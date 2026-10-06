/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        judiciary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#0b3c1d',
          950: '#052210',
        },
        wtc: {
          blue: '#0F172A',
          navy: '#0B132B',
          gold: '#D97706',
          'gold-light': '#F59E0B',
          accent: '#10B981'
        }
      },
      fontFamily: {
        serif: ['Times New Roman', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
};
