import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import path from 'node:path'

const devHost = 'buro-bank.ru'
const localHost = 'localhost'
const useLocalDomain = process.env.VITE_DEV_HOST === devHost
const useDevProxy = process.env.VITE_DEV_PROXY === 'true'
const hmrPort = useDevProxy ? 443 : 5173

export default defineConfig({
  plugins: [react(), useLocalDomain && basicSsl()],
  server: {
    allowedHosts: useLocalDomain ? [devHost] : [],
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    open: useLocalDomain
      ? `https://${devHost}:5173`
      : `http://${localHost}:5173`,
    hmr: useLocalDomain
      ? {
          host: devHost,
          clientPort: hmrPort,
          protocol: 'wss',
        }
      : undefined,
    proxy: {
      '/api': {
        changeOrigin: true,
        headers: {
          origin: 'http://localhost:8080',
        },
        rewrite: (path) => path.replace(/^\/api/, ''),
        target: 'http://localhost:8080',
        ws: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
