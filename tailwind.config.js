/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {

        primary: {
          950: '#0B1430',
          900: '#15192B',
          800: '#1E2748',
          700: '#2F49D6',
          600: '#3B5BFF', 
        },
       
        surface: {
          50: '#F4F6FB',  
          100: '#EDEFF7', 
          200: '#E7EAF3', 
        },
      
        ink: {
          900: '#15192B', 
          700: '#6B7280', 
          400: '#9AA3B5', 
        },
      },
      fontFamily: {
        display: ['"Poppins"', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.1rem',
      },
      boxShadow: {
        card: '0 2px 10px rgba(21, 25, 43, 0.06)',
        'card-lg': '0 12px 28px rgba(21, 25, 43, 0.12)',
      },
    },
  },
  plugins: [],
};
