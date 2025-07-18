import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: [
      'all',
      'd4aa3e17-9069-43b5-9fa8-d7e6662143de-00-3egns4yo3cyy5.janeway.replit.dev',
      'localhost',
      '127.0.0.1'
    ]
  },
});