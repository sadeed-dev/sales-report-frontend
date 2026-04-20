import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  
  resolve: {
    alias: {
      '@': '/src',
    },
  },

  server: {
    host: true, 
    watch: {
      usePolling: true,   
      interval: 100       
    },
    hmr: {
      overlay: true
    }
  }
})




