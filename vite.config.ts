import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import path from 'node:path'

const devHost = 'buro-bank.ru'
const useDevProxy = process.env.VITE_DEV_PROXY === 'true'

export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    allowedHosts: [devHost],
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    open: `https://${devHost}:5173`,
    hmr: {
      host: devHost,
      clientPort: useDevProxy ? 443 : 5173,
      protocol: 'wss',
    },
    proxy: {
      '/api': {
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        target: 'http://localhost:8080',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
