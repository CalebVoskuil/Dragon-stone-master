/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Stone Dragon Brand Colors from tokens
        'sd-deep-purple': '#58398B',
        'sd-medium-purple': '#7B4CB3',
        'sd-golden': '#FFD60A',
        'sd-orange': '#F77F00',
        'sd-red': '#E63946',
        'sd-green': '#3BB273',
        'sd-dark': '#2D2D2D',
        'sd-light': '#FFFFFF',
        'sd-bg': '#FDFDFD',
        
        // Status Colors
        'sd-accept': '#FFD60A',
        'sd-pending': '#F77F00',
        'sd-reject': '#E63946',
      },
      borderRadius: {
        'sd-page': '20px',
        'sd-card': '16px',
        'sd-button': '12px',
        'sd-chip': '8px',
      },
      spacing: {
        'sd-base': '8px',
        'sd-card-padding': '16px',
        'sd-page-margin': '16px',
      },
    },
  },
  plugins: [],
}

