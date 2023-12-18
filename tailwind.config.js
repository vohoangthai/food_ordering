/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
   purge: [

     './public/**/*.html',

     './src/**/*.{js,jsx,ts,tsx,vue}',

   ],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/tw-elements/dist/js/**/*.js"
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        'product': '40% 60%',
    },
    
  },
  plugins: [require("tw-elements/dist/plugin.cjs")],
}}