import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],

  server: {
    host: true,
    port: 6565,
    // open: true,
    strictPort: false,
    // proxy: {
    //   '/api': {
    //     target: 'http://10.10.220.23:9092',
    //     changeOrigin: true,
    //     secure: false,
    //   },
    // },
  },
});
