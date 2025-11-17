import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/static/omero_parade2/',
  build: {
    // these are defaults, but being explicit...
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
