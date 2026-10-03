/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ColorHunt Palette: #8DBCC7, #A4CCD9, #C4E1E6, #EBFFD8
        palette: {
          deep: '#8DBCC7',     // Main Teal Blue
          mid: '#A4CCD9',      // Soft Sky Accent
          soft: '#C4E1E6',     // Pale Mint Foam
          highlight: '#EBFFD8',// Tender Spring Lime
        },
      },
    },
  },
  plugins: [],
};
