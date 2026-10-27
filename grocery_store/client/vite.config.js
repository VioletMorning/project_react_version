import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/shop/',
  plugins: [react()],
  server: {
    proxy: { '/api': 'http://localhost:3000' }
  }
});