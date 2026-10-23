import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    strictPort: true,
    allowedHosts: ['.app.github.dev'],
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
