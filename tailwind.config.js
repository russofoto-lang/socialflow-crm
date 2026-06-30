/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#15151f',
        muted: '#667085',
        line: '#e7e9ef',
        brand: {
          50: '#f0f7ff',
          100: '#dbeeff',
          500: '#2684ff',
          600: '#156fe0',
          700: '#145db8'
        },
        coral: '#ff6b6b',
        mint: '#16b897',
        amber: '#f59e0b'
      },
      boxShadow: {
        soft: '0 14px 40px rgba(21, 21, 31, 0.08)'
      }
    }
  },
  plugins: []
};
