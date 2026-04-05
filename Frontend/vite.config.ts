import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
  ],

  define: {
    'process.env': {},        
    global: 'globalThis',       
  },

  server: {
    host: true,
    port: 5173,
    proxy: {
      '/gigachat-oauth': {
        target: 'https://ngw.devices.sberbank.ru:9443',
        changeOrigin: true,
        secure: false,                    // ← отключает проверку сертификата
        rewrite: (path) => path.replace(/^\/gigachat-oauth/, '/api/v2/oauth'),
      },

      '/gigachat-chat': {
        target: 'https://gigachat.devices.sberbank.ru',
        changeOrigin: true,
        secure: false,                    // ← тоже важно
        rewrite: (path) => path.replace(/^\/gigachat-chat/, '/api/v1/chat/completions'),
      },

      '/items': {
        target: 'http://backend-dev:4000',
        changeOrigin: true,
      },
    },
    watch: {
      usePolling: true,
    },
    hmr: {
      host: 'localhost',
    },
  },
})