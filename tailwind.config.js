/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#4f46e5',
          600: '#4338ca',
          700: '#3730a3',
          800: '#312e81',
          900: '#1e1b4b'
        },
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          500: '#7c3aed',
          600: '#7c2d12',
          700: '#6b21a8',
          800: '#581c87',
          900: '#3b0764'
        },
        accent: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b'
        },
        surface: '#f9fafb',
        background: '#ffffff'
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif']
      },
      boxShadow: {
        'custom': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'elevation': '0 4px 12px rgba(0, 0, 0, 0.15)',
        'premium': '0 8px 32px rgba(0, 0, 0, 0.12)'
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        'gradient-accent': 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
        'gradient-surface': 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)'
      }
    },
  },
  plugins: [],
}