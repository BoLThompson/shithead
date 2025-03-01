import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    //polyfill to get socket.io working on vite?
    global: 'window'
  }
})
