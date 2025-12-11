import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // This allows ngrok (and other tunnels) to access your PC
    allowedHosts: true, 
  }
})