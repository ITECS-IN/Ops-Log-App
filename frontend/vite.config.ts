
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'spa-fallback',
      configureServer(server) {
        return () => {
          server.middlewares.use((req, _res, next) => {
            // Handle SPA routing - serve index.html for all routes except assets
            const { url } = req;
            if (
              url &&
              !url.startsWith('/src') &&
              !url.startsWith('/@') &&
              !url.startsWith('/node_modules') &&
              !url.includes('.') &&
              url !== '/index.html'
            ) {
              req.url = '/';
            }
            next();
          });
        };
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
  },
  ssr: {
    noExternal: ['react', 'react-dom', 'react-router', 'react-router-dom'],
  },
});
