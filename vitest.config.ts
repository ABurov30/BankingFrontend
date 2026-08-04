import path from 'node:path'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['src/test/setup.ts'],
    coverage: {
      exclude: [
        'src/main.tsx',
        'src/shared/api/schema.ts',
        '**/*.d.ts',
        '**/index.ts',
      ],
      include: ['src/**/*.{ts,tsx}'],
      reporter: ['text', 'json-summary', 'html', 'lcov'],
      reportsDirectory: 'coverage',
    },
  },
})
