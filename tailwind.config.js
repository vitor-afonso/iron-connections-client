module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui'), require('@tailwindcss/forms'), require('tailwind-scrollbar-hide')],
  daisyui: {
    themes: ['light'],
  },
};
