import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import vuetify from 'vite-plugin-vuetify'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  server: {
    port: 3000,
    open: true,
    host: '0.0.0.0',
    strictPort: true,
    allowedHosts: ['.ngrok-free.app', 'localhost'],
    hmr: {
      host: 'localhost'
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  optimizeDeps: {
    include: ['vue', 'vuetify', 'vue-router', '@vueuse/core']
  }
})