import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api/crossref': {
        target: 'https://api.crossref.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/crossref/, ''),
        headers: {
          'User-Agent': 'LibraryAI/1.0 (mailto:contact@libraryai.edu)'
        }
      },
      '/api/openlibrary': {
        target: 'https://openlibrary.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/openlibrary/, '')
      },
      '/api/arxiv': {
        target: 'https://export.arxiv.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/arxiv/, ''),
        headers: {
          'User-Agent': 'LibraryAI/1.0 (mailto:contact@libraryai.edu)'
        }
      },
      '/api/semantic': {
        target: 'https://api.semanticscholar.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/semantic/, '')
      },
      '/api/googlebooks': {
        target: 'https://www.googleapis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/googlebooks/, '')
      }
    }
  }
});