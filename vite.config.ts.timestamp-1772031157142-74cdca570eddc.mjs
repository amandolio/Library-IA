// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
process.setMaxListeners && process.setMaxListeners(50);
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/crossref": {
        target: "https://api.crossref.org",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/crossref/, ""),
        headers: {
          "User-Agent": "LibraryAI/1.0 (mailto:contact@libraryai.edu)"
        }
      },
      "/api/openlibrary": {
        target: "https://openlibrary.org",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/openlibrary/, "")
      },
      "/api/arxiv": {
        target: "https://export.arxiv.org",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/arxiv/, ""),
        headers: {
          "User-Agent": "LibraryAI/1.0 (mailto:contact@libraryai.edu)"
        }
      },
      "/api/semantic": {
        target: "https://api.semanticscholar.org",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/semantic/, "")
      },
      "/api/googlebooks": {
        target: "https://www.googleapis.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/googlebooks/, "")
      }
    }
  },
  define: {
    // Configuraciones globales para evitar warnings de listeners
    "process.env.NODE_OPTIONS": JSON.stringify("--max-old-space-size=4096")
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === "CIRCULAR_DEPENDENCY") return;
        if (warning.message.includes("MaxListenersExceededWarning")) return;
        warn(warning);
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuXG4vLyBDb25maWd1cmFyIGxcdTAwRURtaXRlcyBkZSBldmVudCBsaXN0ZW5lcnMgcGFyYSBldml0YXIgd2FybmluZ3NcbnByb2Nlc3Muc2V0TWF4TGlzdGVuZXJzICYmIHByb2Nlc3Muc2V0TWF4TGlzdGVuZXJzKDUwKTtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcbiAgc2VydmVyOiB7XG4gICAgcHJveHk6IHtcbiAgICAgICcvYXBpL2Nyb3NzcmVmJzoge1xuICAgICAgICB0YXJnZXQ6ICdodHRwczovL2FwaS5jcm9zc3JlZi5vcmcnLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGlcXC9jcm9zc3JlZi8sICcnKSxcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICdVc2VyLUFnZW50JzogJ0xpYnJhcnlBSS8xLjAgKG1haWx0bzpjb250YWN0QGxpYnJhcnlhaS5lZHUpJ1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJy9hcGkvb3BlbmxpYnJhcnknOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHBzOi8vb3BlbmxpYnJhcnkub3JnJyxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpXFwvb3BlbmxpYnJhcnkvLCAnJylcbiAgICAgIH0sXG4gICAgICAnL2FwaS9hcnhpdic6IHtcbiAgICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly9leHBvcnQuYXJ4aXYub3JnJyxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpXFwvYXJ4aXYvLCAnJyksXG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAnVXNlci1BZ2VudCc6ICdMaWJyYXJ5QUkvMS4wIChtYWlsdG86Y29udGFjdEBsaWJyYXJ5YWkuZWR1KSdcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICcvYXBpL3NlbWFudGljJzoge1xuICAgICAgICB0YXJnZXQ6ICdodHRwczovL2FwaS5zZW1hbnRpY3NjaG9sYXIub3JnJyxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpXFwvc2VtYW50aWMvLCAnJylcbiAgICAgIH0sXG4gICAgICAnL2FwaS9nb29nbGVib29rcyc6IHtcbiAgICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20nLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGlcXC9nb29nbGVib29rcy8sICcnKVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgZGVmaW5lOiB7XG4gICAgLy8gQ29uZmlndXJhY2lvbmVzIGdsb2JhbGVzIHBhcmEgZXZpdGFyIHdhcm5pbmdzIGRlIGxpc3RlbmVyc1xuICAgICdwcm9jZXNzLmVudi5OT0RFX09QVElPTlMnOiBKU09OLnN0cmluZ2lmeSgnLS1tYXgtb2xkLXNwYWNlLXNpemU9NDA5NicpLFxuICB9LFxuICBidWlsZDoge1xuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG9ud2Fybih3YXJuaW5nLCB3YXJuKSB7XG4gICAgICAgIC8vIFN1cHJpbWlyIHdhcm5pbmdzIGVzcGVjXHUwMEVEZmljb3MgZGUgZXZlbnQgbGlzdGVuZXJzXG4gICAgICAgIGlmICh3YXJuaW5nLmNvZGUgPT09ICdDSVJDVUxBUl9ERVBFTkRFTkNZJykgcmV0dXJuO1xuICAgICAgICBpZiAod2FybmluZy5tZXNzYWdlLmluY2x1ZGVzKCdNYXhMaXN0ZW5lcnNFeGNlZWRlZFdhcm5pbmcnKSkgcmV0dXJuO1xuICAgICAgICB3YXJuKHdhcm5pbmcpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSkiXSwKICAibWFwcGluZ3MiOiAiO0FBQXlOLFNBQVMsb0JBQW9CO0FBQ3RQLE9BQU8sV0FBVztBQUdsQixRQUFRLG1CQUFtQixRQUFRLGdCQUFnQixFQUFFO0FBR3JELElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixRQUFRO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDTCxpQkFBaUI7QUFBQSxRQUNmLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFNBQVMsQ0FBQyxTQUFTLEtBQUssUUFBUSxvQkFBb0IsRUFBRTtBQUFBLFFBQ3RELFNBQVM7QUFBQSxVQUNQLGNBQWM7QUFBQSxRQUNoQjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLG9CQUFvQjtBQUFBLFFBQ2xCLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFNBQVMsQ0FBQyxTQUFTLEtBQUssUUFBUSx1QkFBdUIsRUFBRTtBQUFBLE1BQzNEO0FBQUEsTUFDQSxjQUFjO0FBQUEsUUFDWixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxTQUFTLENBQUMsU0FBUyxLQUFLLFFBQVEsaUJBQWlCLEVBQUU7QUFBQSxRQUNuRCxTQUFTO0FBQUEsVUFDUCxjQUFjO0FBQUEsUUFDaEI7QUFBQSxNQUNGO0FBQUEsTUFDQSxpQkFBaUI7QUFBQSxRQUNmLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFNBQVMsQ0FBQyxTQUFTLEtBQUssUUFBUSxvQkFBb0IsRUFBRTtBQUFBLE1BQ3hEO0FBQUEsTUFDQSxvQkFBb0I7QUFBQSxRQUNsQixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxTQUFTLENBQUMsU0FBUyxLQUFLLFFBQVEsdUJBQXVCLEVBQUU7QUFBQSxNQUMzRDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUE7QUFBQSxJQUVOLDRCQUE0QixLQUFLLFVBQVUsMkJBQTJCO0FBQUEsRUFDeEU7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLGVBQWU7QUFBQSxNQUNiLE9BQU8sU0FBUyxNQUFNO0FBRXBCLFlBQUksUUFBUSxTQUFTLHNCQUF1QjtBQUM1QyxZQUFJLFFBQVEsUUFBUSxTQUFTLDZCQUE2QixFQUFHO0FBQzdELGFBQUssT0FBTztBQUFBLE1BQ2Q7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
