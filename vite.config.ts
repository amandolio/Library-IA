import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configurar límites de event listeners para evitar warnings
process.setMaxListeners && process.setMaxListeners(50);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
  },
  define: {
    // Configuraciones globales para evitar warnings de listeners
    'process.env.NODE_OPTIONS': JSON.stringify('--max-old-space-size=4096'),
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Suprimir warnings específicos de event listeners
        if (warning.code === 'CIRCULAR_DEPENDENCY') return;
        if (warning.message.includes('MaxListenersExceededWarning')) return;
        warn(warning);
      }
    }
  }
})