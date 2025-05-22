import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
server: {
    allowedHosts: [
      'localhost',
      '3a65-180-242-131-32.ngrok-free.app' // <- tambahkan domain ini
    ]
  }
})
