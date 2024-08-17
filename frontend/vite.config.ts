import { defineConfig } from 'vite'
import { resolve, join } from 'path'

import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: "src",
  build: {
    rollupOptions: {
      input: join(__dirname, 'src/index.html'),
    },
  },
})

